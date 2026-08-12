from typing import Optional

import requests

from qai_research.core.models import PageDocument


class HTTPPageFetcher:
    """
    جلب صفحات الويب الفعلية عبر HTTP.

    مسؤول فقط عن:
    - إرسال HTTP request
    - استقبال الصفحة
    - حفظ metadata الأساسية

    لا يقوم بالبحث ولا الترتيب ولا التعلم ولا الاتصال بـ QAI.
    """

    name = "http"

    def __init__(
        self,
        timeout: int = 15,
        max_bytes: int = 5_000_000,
    ):
        self.timeout = timeout
        self.max_bytes = max_bytes
        self.last_error: Optional[str] = None

        self.session = requests.Session()

        self.session.headers.update(
            {
                "User-Agent": (
                    "Quavron-QAI-Research/1.0 "
                    "(Web Research)"
                ),
                "Accept": (
                    "text/html,application/xhtml+xml,"
                    "application/xml;q=0.9,*/*;q=0.8"
                ),
                "Accept-Language": (
                    "ar,en;q=0.8,fr;q=0.7"
                ),
            }
        )

    def fetch(self, url: str) -> PageDocument:
        self.last_error = None

        url = str(url or "").strip()

        if not url:
            self.last_error = "Empty URL"
            return PageDocument(
                url=url,
                fetched=False,
            )

        try:
            response = self.session.get(
                url,
                timeout=self.timeout,
                allow_redirects=True,
                stream=True,
            )

            content_type = (
                response.headers.get(
                    "Content-Type",
                    "",
                )
                .split(";")[0]
                .strip()
                .lower()
            )

            content_length = response.headers.get(
                "Content-Length"
            )

            if (
                content_length
                and content_length.isdigit()
                and int(content_length) > self.max_bytes
            ):
                self.last_error = (
                    f"Response exceeds maximum size: "
                    f"{content_length} bytes"
                )

                return PageDocument(
                    url=str(response.url),
                    status_code=response.status_code,
                    content_type=content_type,
                    fetched=False,
                )

            chunks = []
            total = 0

            for chunk in response.iter_content(
                chunk_size=64 * 1024,
            ):
                if not chunk:
                    continue

                total += len(chunk)

                if total > self.max_bytes:
                    self.last_error = (
                        "Response exceeds maximum "
                        "allowed bytes"
                    )

                    return PageDocument(
                        url=str(response.url),
                        status_code=response.status_code,
                        content_type=content_type,
                        fetched=False,
                    )

                chunks.append(chunk)

            raw_content = b"".join(chunks)

            encoding = (
                response.encoding
                or response.apparent_encoding
                or "utf-8"
            )

            try:
                content = raw_content.decode(
                    encoding,
                    errors="replace",
                )
            except LookupError:
                content = raw_content.decode(
                    "utf-8",
                    errors="replace",
                )

            return PageDocument(
                url=str(response.url),
                content=content,
                fetched=response.ok,
                status_code=response.status_code,
                content_type=content_type,
                metadata={
                    "requested_url": url,
                    "final_url": str(response.url),
                    "content_length": len(raw_content),
                    "encoding": encoding,
                    "redirected": (
                        str(response.url) != url
                    ),
                },
            )

        except requests.RequestException as exc:
            self.last_error = (
                f"{type(exc).__name__}: {exc}"
            )

            return PageDocument(
                url=url,
                fetched=False,
                metadata={
                    "error": self.last_error,
                },
            )

    def health(self):
        return {
            "name": self.name,
            "timeout": self.timeout,
            "max_bytes": self.max_bytes,
            "last_error": self.last_error,
        }

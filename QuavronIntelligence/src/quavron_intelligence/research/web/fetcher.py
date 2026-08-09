from __future__ import annotations

from urllib.request import Request, urlopen

from .models import Page


class WebFetcher:
    """
    Dependency-free HTTP/HTTPS page fetcher.

    This layer only retrieves public pages.
    It does not use an external AI provider.
    """

    USER_AGENT = (
        "Mozilla/5.0 "
        "(compatible; QuavronKnowledgeResearch/1.0)"
    )

    def __init__(self, timeout: int = 15):
        self.timeout = timeout

    def fetch(self, url: str) -> Page:
        url = str(url or "").strip()

        if not url:
            raise ValueError("url cannot be empty")

        request = Request(
            url,
            headers={
                "User-Agent": self.USER_AGENT,
                "Accept": (
                    "text/html,application/xhtml+xml,"
                    "application/xml;q=0.9,*/*;q=0.8"
                ),
            },
        )

        with urlopen(request, timeout=self.timeout) as response:
            raw = response.read()

            content_type = response.headers.get(
                "Content-Type",
                "text/html",
            )

            charset = (
                response.headers.get_content_charset()
                or "utf-8"
            )

            try:
                content = raw.decode(
                    charset,
                    errors="replace",
                )
            except LookupError:
                content = raw.decode(
                    "utf-8",
                    errors="replace",
                )

            return Page(
                url=response.geturl(),
                html=content,
                content=content,
                status_code=response.status,
                content_type=content_type,
            )

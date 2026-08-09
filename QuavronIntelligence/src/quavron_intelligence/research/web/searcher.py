from __future__ import annotations

import re
from typing import List
from urllib.parse import quote, urljoin
from urllib.request import Request, urlopen


class WebSearcher:
    """
    Lightweight web search layer.

    The provider is isolated from the rest of QAI so it can later
    be replaced or extended with multiple search providers.
    """

    USER_AGENT = (
        "Mozilla/5.0 "
        "(compatible; QuavronKnowledgeResearch/1.0)"
    )

    def __init__(self, timeout: int = 15):
        self.timeout = timeout

    def fetch(self, url: str) -> str:
        if not str(url or "").strip():
            raise ValueError("url cannot be empty")

        request = Request(
            url,
            headers={
                "User-Agent": self.USER_AGENT,
                "Accept": "text/html,application/xhtml+xml",
            },
        )

        with urlopen(request, timeout=self.timeout) as response:
            content_type = response.headers.get(
                "Content-Type",
                "",
            )

            if (
                "text" not in content_type
                and "html" not in content_type
                and not content_type
            ):
                raise ValueError(
                    f"Unsupported content type: {content_type}"
                )

            data = response.read()

        charset = (
            response.headers.get_content_charset()
            or "utf-8"
        )

        return data.decode(
            charset,
            errors="replace",
        )

    def search(self, query: str) -> List[str]:
        query = str(query or "").strip()

        if not query:
            return []

        url = (
            "https://html.duckduckgo.com/html/?q="
            + quote(query)
        )

        try:
            html = self.fetch(url)
        except Exception:
            return []

        results: list[str] = []
        seen: set[str] = set()

        patterns = [
            r'class=["\'][^"\']*result__a[^"\']*["\'][^>]*'
            r'href=["\']([^"\']+)["\']',
            r'href=["\'](https?://[^"\']+)["\']',
        ]

        for pattern in patterns:
            for match in re.findall(
                pattern,
                html,
                flags=re.IGNORECASE,
            ):
                candidate = match.strip()

                if candidate.startswith("//"):
                    candidate = "https:" + candidate

                candidate = urljoin(
                    "https://html.duckduckgo.com/",
                    candidate,
                )

                if not candidate.startswith(
                    ("http://", "https://")
                ):
                    continue

                if candidate in seen:
                    continue

                seen.add(candidate)
                results.append(candidate)

                if len(results) >= 10:
                    return results

        return results

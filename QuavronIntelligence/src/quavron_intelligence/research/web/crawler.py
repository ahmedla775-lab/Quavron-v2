from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from urllib.parse import urlparse

from .extractor import ContentExtractor
from .fetcher import WebFetcher


@dataclass
class CrawlResult:
    pages: list[dict] = field(default_factory=list)
    visited: list[str] = field(default_factory=list)
    failed: list[dict] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)


class WebCrawler:
    """
    Multi-page web crawler for Quavron Knowledge Research.

    The crawler:
    - starts from one or more URLs
    - follows discovered links
    - avoids duplicate URLs
    - optionally stays inside the same domain
    - extracts structured page content
    - records failed pages without stopping the crawl
    """

    def __init__(
        self,
        fetcher: WebFetcher | None = None,
        extractor: ContentExtractor | None = None,
        max_pages: int = 10,
        same_domain: bool = True,
    ):
        if max_pages < 1:
            raise ValueError("max_pages must be >= 1")

        self.fetcher = fetcher or WebFetcher()
        self.extractor = extractor or ContentExtractor()
        self.max_pages = max_pages
        self.same_domain = same_domain

    @staticmethod
    def _normalize_url(url: str) -> str:
        return str(url or "").strip()

    @staticmethod
    def _domain(url: str) -> str:
        return urlparse(url).netloc.lower()

    def crawl(self, start_urls: list[str] | tuple[str, ...]) -> CrawlResult:
        queue = deque(
            self._normalize_url(url)
            for url in start_urls
            if self._normalize_url(url)
        )

        if not queue:
            return CrawlResult(
                metadata={
                    "status": "empty",
                    "pages_crawled": 0,
                }
            )

        visited: set[str] = set()
        queued: set[str] = set(queue)

        first_url = queue[0]
        root_domain = self._domain(first_url)

        result = CrawlResult()

        while queue and len(result.pages) < self.max_pages:
            url = queue.popleft()

            if url in visited:
                continue

            visited.add(url)

            try:
                page = self.fetcher.fetch(url)
                extracted = self.extractor.extract(page)

                result.pages.append(extracted)
                result.visited.append(url)

                for link in extracted.get("links", []):
                    link = self._normalize_url(link)

                    if not link:
                        continue

                    if link in visited or link in queued:
                        continue

                    if self.same_domain:
                        if self._domain(link) != root_domain:
                            continue

                    queued.add(link)
                    queue.append(link)

            except Exception as exc:
                result.failed.append(
                    {
                        "url": url,
                        "error": str(exc),
                    }
                )

        result.metadata = {
            "status": "completed",
            "pages_crawled": len(result.pages),
            "pages_failed": len(result.failed),
            "pages_visited": len(result.visited),
            "max_pages": self.max_pages,
            "same_domain": self.same_domain,
            "remaining_queue": len(queue),
        }

        return result

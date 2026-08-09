from __future__ import annotations

from .models import Page
from .fetcher import WebFetcher


class PageReader:
    """
    Reads public web pages and returns a normalized Page object.
    """

    def __init__(self, fetcher: WebFetcher | None = None):
        self.fetcher = fetcher or WebFetcher()

    def read(self, url: str) -> Page:
        if not str(url or "").strip():
            raise ValueError("url cannot be empty")

        return self.fetcher.fetch(url)

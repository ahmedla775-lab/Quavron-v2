from __future__ import annotations

from html.parser import HTMLParser
from typing import Any
from urllib.parse import urljoin

from .models import Page


class _HTMLParser(HTMLParser):
    """
    Lightweight dependency-free HTML parser.

    Extracts:
    - title
    - visible text
    - hyperlinks
    """

    IGNORED_TAGS = {
        "script",
        "style",
        "noscript",
        "template",
        "svg",
    }

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)

        self.title_parts: list[str] = []
        self.text_parts: list[str] = []
        self.links: list[str] = []

        self._in_title = False
        self._ignored_depth = 0

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        tag = tag.lower()

        if tag in self.IGNORED_TAGS:
            self._ignored_depth += 1
            return

        if self._ignored_depth:
            return

        if tag == "title":
            self._in_title = True

        if tag == "a":
            attributes = dict(attrs)
            href = attributes.get("href")

            if href:
                self.links.append(href)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()

        if tag in self.IGNORED_TAGS:
            if self._ignored_depth:
                self._ignored_depth -= 1
            return

        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._ignored_depth:
            return

        value = " ".join(data.split())

        if not value:
            return

        if self._in_title:
            self.title_parts.append(value)
        else:
            self.text_parts.append(value)


class ContentExtractor:
    """
    Converts raw HTML into structured page information.
    """

    def _parse(self, html: str) -> _HTMLParser:
        parser = _HTMLParser()

        try:
            parser.feed(str(html or ""))
            parser.close()
        except Exception:
            pass

        return parser

    def extract_title(self, html: str) -> str:
        parser = self._parse(html)
        return " ".join(parser.title_parts).strip()

    def extract_text(self, html: str) -> str:
        parser = self._parse(html)
        return " ".join(parser.text_parts).strip()

    def extract_links(
        self,
        html: str,
        base_url: str,
    ) -> list[str]:
        parser = self._parse(html)

        links: list[str] = []
        seen: set[str] = set()

        for href in parser.links:
            href = href.strip()

            if not href:
                continue

            if href.startswith(("#", "javascript:", "mailto:")):
                continue

            absolute = urljoin(base_url, href)

            if absolute in seen:
                continue

            seen.add(absolute)
            links.append(absolute)

        return links

    def extract(self, page: Page) -> dict[str, Any]:
        if page is None:
            raise TypeError("page cannot be None")

        if not hasattr(page, "url"):
            raise TypeError("page must provide a 'url' attribute")

        if not hasattr(page, "html") and not hasattr(page, "content"):
            raise TypeError(
                "page must provide an 'html' or 'content' attribute"
            )

        html = getattr(page, "html", None)
        if html is None:
            html = getattr(page, "content", "")

        url = str(page.url)

        return {
            "url": url,
            "title": self.extract_title(html),
            "text": self.extract_text(html),
            "links": self.extract_links(
                html,
                url,
            ),
            "status_code": getattr(
                page,
                "status_code",
                None,
            ),
            "content_type": getattr(
                page,
                "content_type",
                "text/html",
            ),
            "error": getattr(
                page,
                "error",
                None,
            ),
        }

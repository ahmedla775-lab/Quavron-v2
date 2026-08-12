import re
from html import unescape
from typing import Optional

from bs4 import BeautifulSoup

from qai_research.core.models import PageDocument


class HTMLExtractor:
    """
    استخراج المحتوى المفيد من صفحات HTML.

    المسؤوليات:
    - استخراج title
    - استخراج اللغة
    - إزالة العناصر غير المفيدة
    - استخراج النص الرئيسي
    - تنظيف النص
    - تحديث PageDocument فقط

    لا يبحث ولا يجلب صفحات ولا يتصل بـ QAI.
    """

    name = "html"

    REMOVE_TAGS = (
        "script",
        "style",
        "noscript",
        "template",
        "svg",
        "canvas",
        "iframe",
        "nav",
        "footer",
        "form",
    )

    def extract(
        self,
        document: PageDocument,
    ) -> PageDocument:

        if not document.content:
            return document

        if not self._is_html(document):
            return document

        try:
            soup = BeautifulSoup(
                document.content,
                "lxml",
            )

            title = self._extract_title(soup)
            language = self._extract_language(soup)

            for tag_name in self.REMOVE_TAGS:
                for tag in soup.find_all(tag_name):
                    tag.decompose()

            main = self._find_main_content(soup)

            text = main.get_text(
                separator=" ",
                strip=True,
            )

            text = self._clean_text(text)

            document.title = title
            document.language = language
            document.content = text

            document.metadata.update(
                {
                    "extractor": self.name,
                    "original_content_type": (
                        document.content_type
                    ),
                    "content_characters": len(text),
                }
            )

            return document

        except Exception as exc:
            document.metadata["extractor_error"] = (
                f"{type(exc).__name__}: {exc}"
            )

            return document

    @staticmethod
    def _is_html(
        document: PageDocument,
    ) -> bool:

        content_type = (
            document.content_type or ""
        ).lower()

        return (
            "text/html" in content_type
            or "application/xhtml+xml"
            in content_type
        )

    @staticmethod
    def _extract_title(
        soup: BeautifulSoup,
    ) -> str:

        if soup.title:
            title = soup.title.get_text(
                " ",
                strip=True,
            )

            if title:
                return title

        heading = soup.find("h1")

        if heading:
            return heading.get_text(
                " ",
                strip=True,
            )

        return ""

    @staticmethod
    def _extract_language(
        soup: BeautifulSoup,
    ) -> Optional[str]:

        html = soup.find("html")

        if not html:
            return None

        language = (
            html.get("lang")
            or html.get("xml:lang")
        )

        if not language:
            return None

        language = str(
            language
        ).strip().lower()

        if "-" in language:
            language = language.split(
                "-",
                1,
            )[0]

        return language or None

    @staticmethod
    def _find_main_content(
        soup: BeautifulSoup,
    ):
        selectors = (
            "main",
            "article",
            '[role="main"]',
        )

        candidates = []

        for selector in selectors:
            candidates.extend(
                soup.select(selector)
            )

        if candidates:
            return max(
                candidates,
                key=lambda node: len(
                    node.get_text(
                        " ",
                        strip=True,
                    )
                ),
            )

        body = soup.body

        if body:
            return body

        return soup

    @staticmethod
    def _clean_text(
        text: str,
    ) -> str:

        text = unescape(text)

        text = re.sub(
            r"\s+",
            " ",
            text,
        )

        text = re.sub(
            r"\n\s*\n+",
            "\n",
            text,
        )

        return text.strip()

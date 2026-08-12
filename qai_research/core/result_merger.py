from typing import Iterable, List, Set
from urllib.parse import urlparse

from qai_research.core.models import SearchResult


class SearchResultMerger:
    """
    دمج وترتيب نتائج البحث القادمة من عدة استعلامات ومحركات.

    هذه الطبقة لا تجلب صفحات ولا تتصل بـ QAI.
    مهمتها فقط تنظيف النتائج ودمجها وترتيبها.
    """

    def __init__(self):
        self.last_errors: List[str] = []

    @staticmethod
    def _normalize_url(url: str) -> str:
        url = str(url or "").strip()

        if not url:
            return ""

        parsed = urlparse(url)

        if parsed.scheme not in {"http", "https"}:
            return ""

        if not parsed.netloc:
            return ""

        normalized = (
            f"{parsed.scheme.lower()}://"
            f"{parsed.netloc.lower()}"
            f"{parsed.path.rstrip('/')}"
        )

        if parsed.query:
            normalized += f"?{parsed.query}"

        return normalized

    @staticmethod
    def _domain(url: str) -> str:
        try:
            return urlparse(url).netloc.lower()
        except Exception:
            return ""

    @staticmethod
    def _text_score(result: SearchResult, query: str) -> float:
        query_tokens = {
            token.lower()
            for token in str(query or "").split()
            if token.strip()
        }

        if not query_tokens:
            return 0.0

        title = str(result.title or "").lower()
        snippet = str(result.snippet or "").lower()

        title_hits = sum(
            1 for token in query_tokens
            if token in title
        )

        snippet_hits = sum(
            1 for token in query_tokens
            if token in snippet
        )

        return (
            title_hits * 3.0
            + snippet_hits * 0.75
        )

    def merge(
        self,
        results: Iterable[SearchResult],
        query: str,
        limit: int = 20,
    ) -> List[SearchResult]:

        self.last_errors = []

        unique = {}
        domain_counts = {}

        for result in results:

            if not isinstance(result, SearchResult):
                continue

            normalized_url = self._normalize_url(result.url)

            if not normalized_url:
                continue

            if normalized_url in unique:
                existing = unique[normalized_url]

                if result.score > existing.score:
                    unique[normalized_url] = result

                continue

            domain = self._domain(normalized_url)

            domain_counts.setdefault(domain, 0)
            domain_counts[domain] += 1

            result.metadata["normalized_url"] = normalized_url
            result.metadata["domain"] = domain

            text_score = self._text_score(result, query)

            result.metadata["text_score"] = text_score

            unique[normalized_url] = result

        merged = list(unique.values())

        for result in merged:
            domain = result.metadata.get("domain", "")
            domain_penalty = max(
                0.0,
                (domain_counts.get(domain, 1) - 1) * 0.05,
            )

            original_score = float(result.score or 0.0)

            result.metadata["merged_score"] = (
                original_score
                + float(result.metadata.get("text_score", 0.0))
                - domain_penalty
            )

        merged.sort(
            key=lambda item: (
                float(
                    item.metadata.get(
                        "merged_score",
                        0.0,
                    )
                ),
                float(item.score or 0.0),
            ),
            reverse=True,
        )

        for rank, result in enumerate(
            merged[:limit],
            start=1,
        ):
            result.rank = rank

        return merged[:limit]

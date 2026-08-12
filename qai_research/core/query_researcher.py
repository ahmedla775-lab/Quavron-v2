from typing import List

from qai_research.core.models import (
    ResearchRequest,
    SearchResult,
)
from qai_research.core.query_strategy import (
    QueryStrategy,
)
from qai_research.filters.relevance import RelevanceFilter
from qai_research.engines.searxng_pool import (
    SearXNGPool,
)

from qai_research.engines.wikipedia import (
    WikipediaSearchEngine,
)


class QueryResearcher:
    """
    تنفيذ البحث عبر عدة صيغ للاستعلام.

    هذه الطبقة مستقلة عن QAI.
    """

    def __init__(
        self,
        search_engine=None,
        strategy=None,
    ):
        self.search_engine = (
            search_engine
            or SearXNGPool()
        )

        self.wikipedia_engine = WikipediaSearchEngine()

        self.strategy = (
            strategy
            or QueryStrategy()
        )

        self.last_errors: List[str] = []
        self.relevance_filter = RelevanceFilter()

    def search(
        self,
        request: ResearchRequest,
    ) -> List[SearchResult]:

        self.last_errors = []

        variants = self.strategy.build(
            query=request.query,
            language=request.language,
        )

        if not variants:
            return []

        collected: List[SearchResult] = []

        seen = set()

        for variant in variants:

            variant_request = ResearchRequest(
                query=variant.query,
                language=variant.language,
                max_results=request.max_results,
                max_pages=request.max_pages,
                include_web=request.include_web,
                include_wikipedia=request.include_wikipedia,
                metadata={
                    **request.metadata,
                    "query_variant": variant.query,
                    "query_purpose": variant.purpose,
                },
            )

            try:
                results = self.search_engine.search(
                    variant_request
                )

            except Exception as exc:
                self.last_errors.append(
                    f"{variant.purpose}: "
                    f"{type(exc).__name__}: {exc}"
                )
                continue

            for result in results:

                url = str(
                    result.url or ""
                ).strip().lower().rstrip("/")

                if not url:
                    continue

                if url in seen:
                    continue

                seen.add(url)

                result.metadata[
                    "query_variant"
                ] = variant.query

                result.metadata[
                    "query_purpose"
                ] = variant.purpose

                result.metadata[
                    "query_priority"
                ] = variant.priority

                collected.append(result)

        # ---------------------------------------------------------
        # WIKIPEDIA FALLBACK
        #
        # SearXNG may return zero or noisy results.
        # Wikipedia is an independent knowledge-search source.
        # Use it before final relevance filtering.
        # ---------------------------------------------------------
        if request.include_wikipedia:
            try:
                wikipedia_results = self.wikipedia_engine.search(
                    request
                )

                for result in wikipedia_results:
                    url = str(
                        result.url or ""
                    ).strip().lower().rstrip("/")

                    if not url or url in seen:
                        continue

                    seen.add(url)

                    result.metadata["query_variant"] = request.query
                    result.metadata["query_purpose"] = "wikipedia"
                    result.metadata["query_priority"] = 0

                    collected.append(result)

            except Exception as exc:
                self.last_errors.append(
                    f"wikipedia: "
                    f"{type(exc).__name__}: {exc}"
                )

        # ---------------------------------------------------------
        # FINAL RELEVANCE GATE
        # ---------------------------------------------------------
        # Query variants are used only to improve discovery.
        # The original user query remains the final relevance authority.
        filtered = self.relevance_filter.filter(
            request.query,
            collected,
        )

        if not filtered:
            self.last_errors.append(
                "No relevant results after final relevance filtering."
            )

        return self._rank(filtered)

    @staticmethod
    def _rank(
        results: List[SearchResult],
    ) -> List[SearchResult]:

        results.sort(
            key=lambda result: (
                result.metadata.get(
                    "query_priority",
                    9999,
                ),
                -float(
                    result.score or 0.0
                ),
            )
        )

        for rank, result in enumerate(
            results,
            1,
        ):
            result.rank = rank

        return results


query_researcher = QueryResearcher()

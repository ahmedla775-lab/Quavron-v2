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

        research_context = (
            request.metadata.get("research_context", {})
            if isinstance(request.metadata, dict)
            else {}
        )

        variants = self.strategy.build(
            query=request.query,
            language=request.language,
            context=research_context,
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
                # Wikipedia must participate in the same variant strategy
                # used by the main search engine.
                #
                # This is critical for compound questions such as:
                #
                #   "من هو آلان تورنغ وما أهم مساهماته؟"
                #
                # The original question is useful for broad discovery,
                # but the extracted entity "آلان تورنغ" is much better
                # for locating the canonical Wikipedia page.

                wikipedia_variants = [
                    request.query,
                    *[
                        variant.query
                        for variant in variants
                        if str(variant.query or "").strip()
                    ],
                ]

                wikipedia_seen_queries = set()

                for wikipedia_query in wikipedia_variants:
                    wikipedia_query = str(
                        wikipedia_query or ""
                    ).strip()

                    if not wikipedia_query:
                        continue

                    normalized_query = wikipedia_query.lower()

                    if normalized_query in wikipedia_seen_queries:
                        continue

                    wikipedia_seen_queries.add(
                        normalized_query
                    )

                    wikipedia_request = ResearchRequest(
                        query=wikipedia_query,
                        language=request.language,
                        max_results=request.max_results,
                        max_pages=request.max_pages,
                        include_web=False,
                        include_wikipedia=True,
                        metadata={
                            **request.metadata,
                            "query_variant": wikipedia_query,
                            "query_purpose": "wikipedia",
                        },
                    )

                    wikipedia_results = (
                        self.wikipedia_engine.search(
                            wikipedia_request
                        )
                    )

                    for result in wikipedia_results:
                        url = str(
                            result.url or ""
                        ).strip().lower().rstrip("/")

                        if not url or url in seen:
                            continue

                        seen.add(url)

                        result.metadata[
                            "query_variant"
                        ] = wikipedia_query

                        result.metadata[
                            "query_purpose"
                        ] = "wikipedia"

                        # Preserve the priority of the variant that
                        # discovered the Wikipedia result.
                        matched_priority = 0

                        for variant in variants:
                            if (
                                variant.query
                                == wikipedia_query
                            ):
                                matched_priority = (
                                    variant.priority
                                )
                                break

                        result.metadata[
                            "query_priority"
                        ] = matched_priority

                        collected.append(result)

            except Exception as exc:
                self.last_errors.append(
                    f"wikipedia: "
                    f"{type(exc).__name__}: {exc}"
                )

        # ---------------------------------------------------------
        # FINAL RELEVANCE SCORING / RANKING
        # ---------------------------------------------------------
        # Query variants are not only discovery metadata.
        # They represent legitimate formulations of the same user intent.
        #
        # The original query remains an important identity signal, but the
        # relevance scoring is also allowed to score a result against
        # the actual variant that discovered it. Results are preserved.
        #
        # This is important for:
        # - Arabic -> English entity discovery
        # - quoted/entity searches
        # - multilingual questions
        # - general research queries
        # - company/entity searches
        #
        # Example:
        # "من هو آلان تورنغ؟"
        # may discover:
        # "Alan Turing"
        #
        # The result must not be rejected merely because its title
        # is English while the original question is Arabic. It remains raw material.

        variant_queries = [
            variant.query
            for variant in variants
            if str(variant.query or "").strip()
        ]

        ranked = self.relevance_filter.filter(
            request.query,
            collected,
            query_variants=variant_queries,
        )

        if not ranked:
            self.last_errors.append(
                "No research results were discovered."
            )

        return self._rank(ranked)

    @staticmethod
    def _rank(
        results: List[SearchResult],
    ) -> List[SearchResult]:

        # Relevance is a ranking signal, NOT a knowledge authority.
        #
        # Query priority is a discovery preference.
        #
        # The returned results are raw research material.
        # QAI must evaluate evidence and correctness later.
        #
        # Ranking only determines processing order; it does not
        # establish truth and must not be treated as validation.
        #
        # Example:
        #
        #   "قائمة الحاصلين على جائزة تورنغ"
        #       relevance = 0.78
        #
        #   "آلان تورنغ"
        #       relevance = 1.00
        #
        # The canonical entity must win regardless of variant priority.

        results.sort(
            key=lambda result: (
                -float(
                    result.relevance or 0.0
                ),
                -float(
                    result.score or 0.0
                ),
                result.metadata.get(
                    "query_priority",
                    9999,
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

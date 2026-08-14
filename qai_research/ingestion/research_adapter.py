from __future__ import annotations

import hashlib
from typing import Any, Dict, Iterable, List

from .raw_models import RawKnowledge


class ResearchAdapter:
    """
    يحول سجلات ResearchResult المتداخلة
    إلى مواد RAW مستقلة قابلة للمعالجة.

    مهم:
    - لا يحذف أي نتيجة.
    - لا يطبق relevance filter.
    - لا يقرر هل المعلومة صحيحة.
    - لا ينتج إجابة للمستخدم.
    """

    @staticmethod
    def _get(value: Any, key: str, default: Any = "") -> Any:
        if isinstance(value, dict):
            return value.get(key, default)

        return getattr(value, key, default)

    @staticmethod
    def _stable_id(
        query: str,
        title: str,
        url: str,
        content: str,
        index: int,
    ) -> str:
        payload = (
            f"{query}\n"
            f"{title}\n"
            f"{url}\n"
            f"{content}\n"
            f"{index}"
        )

        return hashlib.sha256(
            payload.encode("utf-8")
        ).hexdigest()

    def adapt_research(
        self,
        research: Any,
    ) -> List[RawKnowledge]:

        query = str(
            self._get(research, "query", "")
        )

        output: List[RawKnowledge] = []

        search_results = self._get(
            research,
            "search_results",
            [],
        ) or []

        documents = self._get(
            research,
            "documents",
            [],
        ) or []

        research_metadata = self._get(
            research,
            "metadata",
            {},
        )

        if not isinstance(research_metadata, dict):
            research_metadata = {}

        # ---------------------------------------------------------
        # SEARCH RESULTS
        # ---------------------------------------------------------

        for index, result in enumerate(
            search_results
        ):
            title = str(
                self._get(result, "title", "")
            )

            url = str(
                self._get(result, "url", "")
            )

            snippet = str(
                self._get(result, "snippet", "")
            )

            engine = str(
                self._get(result, "engine", "")
            )

            metadata = self._get(
                result,
                "metadata",
                {},
            )

            if not isinstance(metadata, dict):
                metadata = {}

            metadata = {
                **research_metadata,
                **metadata,
                "raw_origin": "research.search_results",
            }

            output.append(
                RawKnowledge(
                    raw_id=self._stable_id(
                        query,
                        title,
                        url,
                        snippet,
                        index,
                    ),
                    query=query,
                    title=title,
                    url=url,
                    snippet=snippet,
                    content="",
                    engine=engine,
                    source_type="search_result",
                    metadata=metadata,
                )
            )

        # ---------------------------------------------------------
        # FETCHED DOCUMENTS
        # ---------------------------------------------------------

        offset = len(output)

        for index, document in enumerate(
            documents
        ):
            title = str(
                self._get(document, "title", "")
            )

            url = str(
                self._get(document, "url", "")
            )

            content = str(
                self._get(document, "content", "")
            )

            engine = str(
                self._get(
                    document,
                    "source_engine",
                    "",
                )
            )

            metadata = self._get(
                document,
                "metadata",
                {},
            )

            if not isinstance(metadata, dict):
                metadata = {}

            metadata = {
                **research_metadata,
                **metadata,
                "raw_origin": "research.documents",
            }

            output.append(
                RawKnowledge(
                    raw_id=self._stable_id(
                        query,
                        title,
                        url,
                        content,
                        offset + index,
                    ),
                    query=query,
                    title=title,
                    url=url,
                    snippet="",
                    content=content,
                    engine=engine,
                    source_type="document",
                    metadata=metadata,
                )
            )

        return output

    def adapt_many(
        self,
        researches: Iterable[Any],
    ) -> List[RawKnowledge]:

        output: List[RawKnowledge] = []

        for research in researches:
            output.extend(
                self.adapt_research(research)
            )

        return output

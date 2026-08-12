from typing import Iterable, List, Optional

from qai_research.core.models import (
    ResearchRequest,
    ResearchResult,
    SearchResult,
)
from qai_research.engines.base import SearchEngine


class SearchEngineManager:
    """
    مدير محركات البحث في QAI Research.

    هذه الطبقة مستقلة بالكامل عن QAI.
    """

    def __init__(
        self,
        engines: Optional[Iterable[SearchEngine]] = None,
    ):
        self._engines: List[SearchEngine] = []

        if engines:
            for engine in engines:
                self.register(engine)

    # =========================================================
    # REGISTRATION
    # =========================================================

    def register(self, engine: SearchEngine):
        if not isinstance(engine, SearchEngine):
            raise TypeError(
                "engine must implement SearchEngine"
            )

        if engine in self._engines:
            return

        self._engines.append(engine)
        self._sort()

    def unregister(self, name: str) -> bool:
        name = str(name or "").strip()

        before = len(self._engines)

        self._engines = [
            engine
            for engine in self._engines
            if engine.name != name
        ]

        return len(self._engines) < before

    def _sort(self):
        self._engines.sort(
            key=lambda engine: (
                getattr(engine, "priority", 100),
                engine.name,
            )
        )

    # =========================================================
    # INSPECTION
    # =========================================================

    def engines(self) -> List[SearchEngine]:
        return list(self._engines)

    def health(self):
        return [
            engine.health()
            for engine in self._engines
        ]

    # =========================================================
    # SEARCH
    # =========================================================

    def search(
        self,
        request: ResearchRequest,
    ) -> ResearchResult:

        result = ResearchResult(
            query=request.query,
        )

        if not request.query.strip():
            result.errors.append(
                "Empty research query."
            )
            return result

        if not request.include_web:
            result.errors.append(
                "Web research is disabled."
            )
            return result

        seen_urls = set()

        for engine in self._engines:

            if len(result.search_results) >= request.max_results:
                break

            try:

                if not engine.available():
                    result.errors.append(
                        f"{engine.name}: unavailable"
                    )
                    continue

                engine.reset_error()

                engine_results = engine.search(
                    request
                )

                if not engine_results:
                    result.errors.append(
                        f"{engine.name}: no results"
                    )
                    continue

                added = 0

                for item in engine_results:

                    if not isinstance(
                        item,
                        SearchResult,
                    ):
                        continue

                    url = str(
                        item.url or ""
                    ).strip()

                    if not url:
                        continue

                    normalized_url = url.lower().rstrip("/")

                    if normalized_url in seen_urls:
                        continue

                    seen_urls.add(
                        normalized_url
                    )

                    if not item.engine:
                        item.engine = engine.name

                    result.search_results.append(
                        item
                    )

                    added += 1

                    if len(
                        result.search_results
                    ) >= request.max_results:
                        break

                if added:
                    result.sources_used.append(
                        engine.name
                    )

            except Exception as exc:

                engine.set_error(exc)

                result.errors.append(
                    f"{engine.name}: "
                    f"{type(exc).__name__}: {exc}"
                )

                # مهم:
                # لا نوقف البحث عند فشل محرك.
                # ننتقل مباشرة للمحرك التالي.

                continue

        result.search_results = sorted(
            result.search_results,
            key=lambda item: (
                item.rank if item.rank > 0 else 999999
            ),
        )

        result.success = bool(
            result.search_results
        )

        result.metadata.update({
            "engines_configured": len(
                self._engines
            ),
            "engines_used": len(
                result.sources_used
            ),
            "result_count": len(
                result.search_results
            ),
        })

        return result


manager = SearchEngineManager()

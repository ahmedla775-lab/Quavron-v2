from typing import List, Tuple

from qai_research.core.models import (
    ResearchRequest,
    SearchResult,
)
from qai_research.filters.relevance import RelevanceFilter


class SourceManager:
    """
    مدير مصادر البحث.

    مسؤول عن:
    - ترتيب المصادر.
    - تجربة المصادر بالتتابع.
    - اعتبار جودة النتائج جزءًا من نجاح المصدر.
    - رفض النتائج غير المرتبطة.
    - الانتقال للمصدر التالي عند الفشل.
    """

    def __init__(
        self,
        engines=None,
        relevance_filter=None,
    ):
        self.engines = sorted(
            list(engines or []),
            key=lambda engine: getattr(
                engine,
                "priority",
                100,
            ),
        )

        self.relevance_filter = (
            relevance_filter
            or RelevanceFilter()
        )

        self.errors: List[str] = []
        self.sources_used: List[str] = []

    def register(self, engine):
        self.engines.append(engine)

        self.engines.sort(
            key=lambda item: getattr(
                item,
                "priority",
                100,
            )
        )

    def search(
        self,
        request: ResearchRequest,
    ) -> Tuple[List[SearchResult], List[str]]:

        self.errors = []
        self.sources_used = []

        accepted_results = []

        for engine in self.engines:

            name = getattr(
                engine,
                "name",
                engine.__class__.__name__,
            )

            try:
                if not engine.available():
                    self.errors.append(
                        f"{name}: unavailable"
                    )
                    continue

                raw_results = engine.search(
                    request
                )

                if not raw_results:
                    self.errors.append(
                        f"{name}: no results"
                    )
                    continue

                filtered = (
                    self.relevance_filter.filter(
                        request.query,
                        raw_results,
                    )
                )

                if not filtered:
                    self.errors.append(
                        f"{name}: "
                        "no relevant results"
                    )
                    continue

                accepted_results.extend(
                    filtered
                )

                self.sources_used.append(
                    name
                )

                # نستخدم المصدر التالي أيضًا
                # للحصول على تنوع في المصادر،
                # لكن نتوقف عند بلوغ الحد المطلوب.
                if len(accepted_results) >= request.max_results:
                    break

            except Exception as exc:
                message = (
                    f"{name}: "
                    f"{type(exc).__name__}: "
                    f"{exc}"
                )

                self.errors.append(message)

        return (
            self._deduplicate(
                accepted_results
            )[: request.max_results],
            self.errors,
        )

    @staticmethod
    def _deduplicate(
        results: List[SearchResult],
    ) -> List[SearchResult]:

        seen = set()
        unique = []

        for result in results:

            url = str(
                result.url or ""
            ).strip().lower()

            if not url or url in seen:
                continue

            seen.add(url)
            unique.append(result)

        for rank, result in enumerate(
            unique,
            1,
        ):
            result.rank = rank

        return unique

    def health(self):
        return {
            "engines": [
                engine.health()
                if hasattr(engine, "health")
                else {
                    "name": getattr(
                        engine,
                        "name",
                        engine.__class__.__name__,
                    )
                }
                for engine in self.engines
            ],
            "errors": list(self.errors),
            "sources_used": list(
                self.sources_used
            ),
        }

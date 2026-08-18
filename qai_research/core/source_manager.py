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
        """
        اكتشاف وتجميع المادة الخام من جميع مصادر البحث.

        القاعدة المعمارية:
        - Discovery مسؤول عن اكتشاف المادة الخام.
        - Relevance لا تحكم على صحة المعرفة.
        - Relevance تستخدم فقط لإعطاء إشارة ترتيب/أولوية.
        - لا يتم حذف نتيجة خارجية بسبب ضعف صلتها بالسؤال.
        - لا يتم اعتبار relevance دليلًا على صحة المحتوى.
        - QAI يقرر لاحقًا ما الذي يمثل دليلًا صالحًا وما الذي يدخل في الإجابة.
        """

        self.errors = []
        self.sources_used = []

        raw_results = []

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

                discovered = engine.search(
                    request
                )

                if not discovered:
                    self.errors.append(
                        f"{name}: no results"
                    )
                    continue

                # -------------------------------------------------
                # RAW DISCOVERY
                # -------------------------------------------------
                # كل ما اكتشفه المصدر يبقى مادة خام.
                # لا relevance gate هنا.
                raw_results.extend(
                    discovered
                )

                self.sources_used.append(
                    name
                )

            except Exception as exc:
                message = (
                    f"{name}: "
                    f"{type(exc).__name__}: "
                    f"{exc}"
                )

                self.errors.append(message)

        if not raw_results:
            return (
                [],
                self.errors,
            )

        # ---------------------------------------------------------
        # RELEVANCE = RANKING SIGNAL ONLY
        # ---------------------------------------------------------
        #
        # نحسب relevance لترتيب المادة الخام فقط.
        # إذا أعاد RelevanceFilter نتيجة، نستخدم ترتيبها.
        # لكن لا نسمح له بتحويل نفسه إلى gate معرفي.
        #
        ranked = self.relevance_filter.filter(
            request.query,
            raw_results,
        )

        # حماية معمارية:
        # إذا كان filter القديم قد أسقط بعض النتائج،
        # نعيد دمجها من المادة الخام الأصلية.
        #
        # الهدف: لا تضيع أي مادة اكتشفها Discovery.
        ranked_by_url = {
            str(
                result.url or ""
            ).strip().lower(): result
            for result in ranked
        }

        final_results = []

        for result in raw_results:
            key = str(
                result.url or ""
            ).strip().lower()

            scored = ranked_by_url.get(key)

            if scored is not None:
                final_results.append(
                    scored
                )
            else:
                # النتيجة لم تمر عبر scoring القديم.
                # تبقى موجودة كمادة خام.
                result.relevance = float(
                    getattr(
                        result,
                        "relevance",
                        0.0,
                    )
                    or 0.0
                )

                final_results.append(
                    result
                )

        # إزالة التكرار التقني فقط.
        # هذا لا يعني رفض المعرفة بسبب relevance.
        final_results = self._deduplicate(
            final_results
        )

        # ترتيب المادة الخام حسب relevance كإشارة معالجة فقط.
        final_results.sort(
            key=lambda result: (
                -float(
                    getattr(
                        result,
                        "relevance",
                        0.0,
                    )
                    or 0.0
                ),
                -float(
                    getattr(
                        result,
                        "score",
                        0.0,
                    )
                    or 0.0
                ),
            )
        )

        for rank, result in enumerate(
            final_results,
            1,
        ):
            result.rank = rank

        return (
            final_results,
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

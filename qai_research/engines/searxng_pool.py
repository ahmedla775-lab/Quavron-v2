from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List

from qai_research.core.models import (
    ResearchRequest,
    SearchResult,
)

from qai_research.engines.base import (
    SearchEngine,
)

from qai_research.engines.searxng import (
    SearXNGSearchEngine,
)

from qai_research.engines.searxng_discovery import (
    SearXNGInstanceDiscovery,
)


class SearXNGPool(SearchEngine):
    """
    مجموعة SearXNG تعمل كطبقة بحث متسامحة مع الأعطال.

    تلتزم بعقد SearchEngine حتى يمكن استخدامها
    مباشرة داخل SourceManager.
    """

    name = "searxng_pool"
    priority = 20

    def __init__(
        self,
        timeout: int = 8,
        max_instances: int = 5,
        workers: int = 5,
    ):
        super().__init__()

        self.timeout = timeout
        self.max_instances = max_instances
        self.workers = workers

        self.discovery = SearXNGInstanceDiscovery(
            timeout=timeout,
        )

        self.engines: List[
            SearXNGSearchEngine
        ] = []

        self.last_errors: List[str] = []

    def available(self) -> bool:
        """
        هل توجد instance صالحة للاستخدام؟
        """

        if self.engines:
            return True

        try:
            self.refresh()

        except Exception as exc:
            self.set_error(exc)
            self.last_errors.append(
                f"discovery: {exc}"
            )
            return False

        return bool(self.engines)

    def discover(self) -> List[str]:
        """
        اكتشاف SearXNG instances التي تعمل فعليًا.

        Discovery يتحقق من الصحة التقنية فقط.
        صلة النتائج تُترك للبحث الفعلي و RelevanceFilter.
        """

        working = self.discovery.find_working(
            limit=self.max_instances
        )

        return [
            str(item.get("url", "")).rstrip("/")
            for item in working
            if item.get("url")
        ]

    def refresh(self) -> int:
        """
        إعادة بناء قائمة المحركات الصالحة.
        """

        self.engines = []
        self.last_errors = []

        urls = self.discover()

        for url in urls:

            self.engines.append(
                SearXNGSearchEngine(
                    base_url=url,
                    timeout=self.timeout,
                )
            )

        return len(self.engines)

    def search(
        self,
        request: ResearchRequest,
    ) -> List[SearchResult]:

        self.reset_error()
        self.last_errors = []

        if not self.engines:
            self.refresh()

        if not self.engines:

            error = (
                "No working SearXNG "
                "instances available"
            )

            self.last_errors.append(
                error
            )

            self.set_error(error)

            return []

        results: List[SearchResult] = []

        worker_count = min(
            max(1, self.workers),
            len(self.engines),
        )

        with ThreadPoolExecutor(
            max_workers=worker_count
        ) as executor:

            futures = {
                executor.submit(
                    engine.search,
                    request,
                ): engine
                for engine in self.engines
            }

            for future in as_completed(
                futures
            ):

                engine = futures[
                    future
                ]

                try:
                    engine_results = (
                        future.result()
                    )

                except Exception as exc:

                    message = (
                        f"{engine.name}: "
                        f"{type(exc).__name__}: "
                        f"{exc}"
                    )

                    self.last_errors.append(
                        message
                    )

                    continue

                if engine.last_error:

                    self.last_errors.append(
                        f"{engine.name}: "
                        f"{engine.last_error}"
                    )

                results.extend(
                    engine_results
                )

        return self._deduplicate(
            results
        )

    @staticmethod
    def _deduplicate(
        results: List[SearchResult],
    ) -> List[SearchResult]:

        unique = {}
        output = []

        for result in results:

            url = str(
                result.url or ""
            ).strip()

            if not url:
                continue

            normalized = (
                url.lower().rstrip("/")
            )

            if normalized in unique:
                continue

            unique[normalized] = True
            output.append(result)

        for index, result in enumerate(
            output,
            start=1,
        ):
            result.rank = index

        return output

    def health(self):
        return {
            "name": self.name,
            "priority": self.priority,
            "instances": len(
                self.engines
            ),
            "errors": list(
                self.last_errors
            ),
            "last_error": self.last_error,
        }

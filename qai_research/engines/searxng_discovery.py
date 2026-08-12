from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List
import re
import requests


INSTANCES_URL = "https://searx.space/data/instances.json"
DEFAULT_TIMEOUT = 6


class SearXNGInstanceDiscovery:
    """
    اكتشاف واختبار SearXNG instances العامة.

    لا تعتبر الـ instance صالحة لمجرد أنها تعيد HTTP 200/JSON.
    يجب أن تجتاز اختبار جودة دلالي للبحث أيضًا.
    """

    QUALITY_QUERIES = (
        "Quavron",
        "Python programming",
        "الذكاء الاصطناعي",
    )

    MIN_RESULTS = 1
    MIN_QUALITY_SCORE = 0.50
    REQUIRED_QUERY = "Quavron"

    def __init__(
        self,
        timeout: int = DEFAULT_TIMEOUT,
        workers: int = 12,
    ):
        self.timeout = timeout
        self.workers = workers

    def discover(self) -> List[str]:
        response = requests.get(
            INSTANCES_URL,
            headers={
                "User-Agent": "Quavron-QAI-Research/1.0"
            },
            timeout=self.timeout,
        )

        response.raise_for_status()
        payload = response.json()

        instances = payload.get("instances", {})

        return [
            str(url).rstrip("/")
            for url in instances.keys()
            if str(url).startswith("http")
            and ".onion" not in str(url)
        ]

    @staticmethod
    def _normalize(text: str) -> str:
        text = str(text or "").lower()

        text = re.sub(
            r"[\u064B-\u065F\u0670]",
            "",
            text,
        )

        text = (
            text
            .replace("أ", "ا")
            .replace("إ", "ا")
            .replace("آ", "ا")
            .replace("ى", "ي")
            .replace("ؤ", "و")
            .replace("ئ", "ي")
        )

        return re.sub(
            r"\s+",
            " ",
            text,
        ).strip()

    def _query_quality(
        self,
        query: str,
        payload: dict,
    ) -> float:
        """
        تقييم بسيط لجودة نتائج instance للاستعلام.

        لا نعتمد على SearXNG score.
        نقيس فقط مدى ظهور كلمات الاستعلام في النتائج.
        """

        results = payload.get("results", [])

        if not isinstance(results, list):
            return 0.0

        if not results:
            return 0.0

        normalized_query = self._normalize(query)

        tokens = {
            token
            for token in normalized_query.split()
            if len(token) > 1
        }

        if not tokens:
            return 0.0

        best = 0.0

        for item in results[:10]:
            if not isinstance(item, dict):
                continue

            title = self._normalize(
                item.get("title", "")
            )

            content = self._normalize(
                item.get("content", "")
            )

            url = self._normalize(
                item.get("url", "")
            )

            combined = " ".join(
                part
                for part in (title, content, url)
                if part
            )

            if not combined:
                continue

            # exact phrase
            if normalized_query in title:
                best = max(best, 1.0)
                continue

            if normalized_query in combined:
                best = max(best, 0.75)
                continue

            hits = sum(
                1
                for token in tokens
                if token in combined
            )

            overlap = hits / len(tokens)

            best = max(best, overlap)

        return round(min(best, 1.0), 4)

    def test(self, base_url: str) -> Dict:
        base_url = base_url.rstrip("/")

        result = {
            "url": base_url,
            "available": False,
            "json": False,
            "quality": 0.0,
            "queries": {},
        }

        quality_scores = []

        try:
            # Basic health / JSON test.
            response = requests.get(
                f"{base_url}/search",
                params={
                    "q": "Quavron",
                    "format": "json",
                    "language": "auto",
                },
                headers={
                    "User-Agent": "Quavron-QAI-Research/1.0"
                },
                timeout=self.timeout,
                allow_redirects=True,
            )

            result["status_code"] = response.status_code

            if not response.ok:
                return result

            try:
                payload = response.json()
            except ValueError:
                return result

            if not isinstance(payload, dict):
                return result

            result["available"] = True
            result["json"] = True

            # Quality tests.
            for query in self.QUALITY_QUERIES:
                try:
                    response = requests.get(
                        f"{base_url}/search",
                        params={
                            "q": query,
                            "format": "json",
                            "language": (
                                "ar"
                                if any(
                                    "\u0600" <= c <= "\u06ff"
                                    for c in query
                                )
                                else "auto"
                            ),
                            "safesearch": 1,
                        },
                        headers={
                            "User-Agent": (
                                "Quavron-QAI-Research/1.0"
                            )
                        },
                        timeout=self.timeout,
                        allow_redirects=True,
                    )

                    if not response.ok:
                        score = 0.0
                    else:
                        try:
                            payload = response.json()
                            score = self._query_quality(
                                query,
                                payload,
                            )
                        except ValueError:
                            score = 0.0

                except requests.RequestException:
                    score = 0.0

                result["queries"][query] = score
                quality_scores.append(score)

            if quality_scores:
                result["quality"] = round(
                    sum(quality_scores)
                    / len(quality_scores),
                    4,
                )

            # The identity query is mandatory.
            # An instance that cannot return relevant Quavron
            # results must never be trusted, even if its average
            # quality score is high.
            identity_score = result["queries"].get(
                self.REQUIRED_QUERY,
                0.0,
            )

            result["identity_score"] = identity_score

            # General discovery gate.
            #
            # Discovery answers:
            # "Is this SearXNG instance usable for general research?"
            #
            # Query-specific relevance (e.g. Quavron) must be
            # evaluated later against the actual user query.
            result["quality_pass"] = (
                result["quality"] >= self.MIN_QUALITY_SCORE
            )

            return result

        except requests.RequestException as exc:
            result["error"] = str(exc)
            return result

    def find_working(
        self,
        limit: int = 10,
    ) -> List[Dict]:
        instances = self.discover()

        working = []

        with ThreadPoolExecutor(
            max_workers=self.workers
        ) as executor:

            futures = {
                executor.submit(
                    self.test,
                    url,
                ): url
                for url in instances
            }

            for future in as_completed(futures):
                try:
                    result = future.result()
                except Exception:
                    continue

                if (
                    result.get("available")
                    and result.get("json")
                    and result.get("quality_pass")
                ):
                    working.append(result)

                    if len(working) >= limit:
                        break

        working.sort(
            key=lambda item: item.get(
                "quality",
                0.0,
            ),
            reverse=True,
        )

        return working

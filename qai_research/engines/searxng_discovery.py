from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List
import requests


INSTANCES_URL = "https://searx.space/data/instances.json"
DEFAULT_TIMEOUT = 6


class SearXNGInstanceDiscovery:
    """
    اكتشاف SearXNG instances العامة.

    مهم:
    Discovery يتحقق فقط من أن الـ instance تعمل وتعيد
    JSON صالحًا من endpoint البحث.

    لا نحكم هنا على صلة النتائج باستعلام المستخدم.
    صلة النتائج مسؤولية QueryResearcher/RelevanceFilter.
    """

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

        if not isinstance(instances, dict):
            return []

        urls = []

        for url in instances.keys():
            url = str(url).rstrip("/")

            if not url.startswith("http"):
                continue

            if ".onion" in url.lower():
                continue

            urls.append(url)

        return urls

    def test(self, base_url: str) -> Dict:
        base_url = str(base_url or "").rstrip("/")

        result = {
            "url": base_url,
            "available": False,
            "json": False,
            "status_code": None,
            "error": None,
        }

        if not base_url:
            return result

        try:
            response = requests.get(
                f"{base_url}/search",
                params={
                    "q": "test",
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

            if not isinstance(
                payload.get("results", []),
                list,
            ):
                return result

            result["available"] = True
            result["json"] = True

            result["result_count"] = len(
                payload.get("results", [])
            )

            return result

        except requests.RequestException as exc:
            result["error"] = (
                f"{type(exc).__name__}: {exc}"
            )
            return result

        except Exception as exc:
            result["error"] = (
                f"{type(exc).__name__}: {exc}"
            )
            return result

    def find_working(
        self,
        limit: int = 10,
    ) -> List[Dict]:

        instances = self.discover()

        if not instances:
            return []

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
                ):
                    working.append(result)

                    if len(working) >= limit:
                        break

        return working

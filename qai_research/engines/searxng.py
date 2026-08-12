from typing import List
from urllib.parse import quote

import requests

from qai_research.core.models import ResearchRequest, SearchResult
from qai_research.engines.base import SearchEngine


class SearXNGSearchEngine(SearchEngine):
    """
    محرك البحث عبر SearXNG.

    لا يعتمد على QAI ولا يغير معماريته.
    """

    name = "searxng"
    priority = 20

    def __init__(
        self,
        base_url: str,
        timeout: int = 15,
    ):
        super().__init__()

        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

        self.session = requests.Session()
        self.session.headers.update(
            {
                "User-Agent": (
                    "Quavron-QAI-Research/1.0 "
                    "(Research Engine)"
                )
            }
        )

    def available(self) -> bool:
        if not self.base_url:
            return False

        try:
            response = self.session.get(
                f"{self.base_url}/search",
                params={
                    "q": "test",
                    "format": "json",
                    "language": "auto",
                },
                timeout=self.timeout,
            )

            return response.ok

        except requests.RequestException as exc:
            self.set_error(exc)
            return False

    def search(
        self,
        request: ResearchRequest,
    ) -> List[SearchResult]:

        self.reset_error()

        query = str(request.query or "").strip()

        if not query:
            return []

        language = request.language or "auto"

        if language == "auto":
            if any(
                "\u0600" <= char <= "\u06ff"
                for char in query
            ):
                language = "ar"

        params = {
            "q": query,
            "format": "json",
            "language": language,
            "safesearch": 1,
        }

        try:
            response = self.session.get(
                f"{self.base_url}/search",
                params=params,
                timeout=self.timeout,
            )

            response.raise_for_status()

            payload = response.json()

        except (
            requests.RequestException,
            ValueError,
        ) as exc:

            self.set_error(exc)
            return []

        raw_results = payload.get("results", [])

        results: List[SearchResult] = []

        for index, item in enumerate(
            raw_results[: request.max_results],
            start=1,
        ):
            url = str(item.get("url") or "").strip()

            if not url:
                continue

            results.append(
                SearchResult(
                    title=str(
                        item.get("title")
                        or ""
                    ).strip(),

                    url=url,

                    snippet=str(
                        item.get("content")
                        or ""
                    ).strip(),

                    engine=self.name,

                    rank=index,

                    score=float(
                        item.get("score") or 0.0
                    ),

                    metadata={
                        "category": item.get(
                            "category"
                        ),
                        "engine": item.get(
                            "engine"
                        ),
                        "parsed_url": item.get(
                            "parsed_url"
                        ),
                        "template": item.get(
                            "template"
                        ),
                    },
                )
            )

        return results

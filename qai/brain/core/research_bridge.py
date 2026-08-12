import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from typing import Any, Dict, List

from qai_research.core.models import ResearchRequest
from qai_research.core.query_researcher import query_researcher



def _qai_fetch_research_page(url):
    """Fetch readable factual content from a research URL."""
    if not url:
        return ""

    try:
        import requests
        from bs4 import BeautifulSoup

        response = requests.get(
            url,
            timeout=15,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Linux; Android 13) "
                    "AppleWebKit/537.36 "
                    "Chrome/120 Safari/537.36"
                )
            },
        )

        if response.status_code != 200:
            return ""

        soup = BeautifulSoup(
            response.text,
            "html.parser",
        )

        for tag in soup.find_all(
            [
                "script",
                "style",
                "noscript",
                "svg",
                "nav",
                "footer",
                "header",
                "form",
            ]
        ):
            tag.decompose()

        blocks = soup.find_all(
            ["article", "main"]
        )

        if blocks:
            content = " ".join(
                block.get_text(" ", strip=True)
                for block in blocks
            )
        else:
            content = soup.get_text(
                " ",
                strip=True,
            )

        import re

        content = re.sub(
            r"\s+",
            " ",
            content,
        ).strip()

        if len(content) < 250:
            return ""

        return content[:12000]

    except Exception as exc:
        print(
            f"[ResearchBridge] page fetch failed: "
            f"{url} :: {exc}"
        )
        return ""

class ResearchBridge:


    def _fetch_page_content(self, url):
        """Fetch real readable content from a research URL."""
        if not url:
            return ""

        try:
            import requests
            from bs4 import BeautifulSoup

            response = requests.get(
                url,
                timeout=15,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (Linux; Android 13) "
                        "AppleWebKit/537.36 "
                        "Chrome/120 Safari/537.36"
                    )
                },
            )

            if response.status_code != 200:
                return ""

            soup = BeautifulSoup(response.text, "html.parser")

            for tag in soup.find_all([
                "script",
                "style",
                "noscript",
                "svg",
                "nav",
                "footer",
                "header",
                "form",
            ]):
                tag.decompose()

            nodes = soup.find_all(["article", "main"])

            parts = []

            for node in nodes:
                value = node.get_text(" ", strip=True)
                if value:
                    parts.append(value)

            if not parts:
                value = soup.get_text(" ", strip=True)
                if value:
                    parts.append(value)

            content = " ".join(parts)

            import re
            content = re.sub(r"\s+", " ", content).strip()

            if len(content) < 250:
                return ""

            return content[:12000]

        except Exception as exc:
            print(
                f"[ResearchBridge] page fetch failed: "
                f"{url} :: {exc}"
            )
            return ""


    def _build_research_evidence(
        self,
        title="",
        url="",
        snippet="",
        content="",
    ):
        """Convert search result into real research evidence."""

        title = str(title or "").strip()
        url = str(url or "").strip()
        snippet = str(snippet or "").strip()
        content = str(content or "").strip()

        evidence = content

        # Real URL content is preferred.
        if url and len(evidence) < 250:
            fetched = self._fetch_page_content(url)

            if fetched:
                evidence = fetched

        # Snippet is only fallback evidence.
        if not evidence:
            evidence = snippet

        # Never use title itself as factual content.
        if evidence and evidence.strip() == title.strip():
            evidence = ""

        return {
            "title": title,
            "url": url,
            "content": evidence,
            "text": evidence,
            "snippet": snippet,
            "source": "qai_research",
            "research_source": "qai_research",
        }


    def _research_result_to_evidence(self, result):
        """Convert a search result into factual research evidence."""
        title = str(getattr(result, "title", "") or "").strip()
        url = str(getattr(result, "url", "") or "").strip()
        snippet = str(getattr(result, "snippet", "") or "").strip()

        content = snippet

        if url:
            try:
                page = self._fetch_page_content(url)
                if page and len(page.strip()) > len(content):
                    content = page.strip()
            except Exception:
                pass

        return {
            "title": title,
            "url": url,
            "content": content,
            "text": content,
            "snippet": snippet,
            "source": "qai_research",
        }



    def __init__(self, researcher=None):
        self.researcher = (
            researcher
            or query_researcher
        )

    def research(
        self,
        question: str,
        max_results: int = 8,
        max_pages: int = 5,
    ) -> Dict[str, Any]:

        question = str(question or "").strip()

        if not question:
            return {
                "success": False,
                "query": question,
                "results": [],
                "documents": [
                {
                    "source": "qai_research",
                    "text": (
                        f"{getattr(result, 'title', '') or ''}\\n"
                        f"{getattr(result, 'snippet', '') or ''}\\n"
                        f"{getattr(result, 'url', '') or ''}"
                    ).strip(),
                    "title": str(
                        getattr(result, "title", "") or ""
                    ),
                    "url": str(
                        getattr(result, "url", "") or ""
                    ),
                    "snippet": str(
                        getattr(result, "snippet", "") or ""
                    ),
                    "engine": str(
                        getattr(result, "engine", "") or ""
                    ),
                    "rank": getattr(result, "rank", 0),
                    "score": getattr(result, "score", 0),
                    "relevance": getattr(result, "score", 0),
                    "approved": False,
                    "trusted": False,
                    "confidence": 0.0,
                }
                for result in results
                if (
                    getattr(result, "title", "")
                    or getattr(result, "snippet", "")
                    or getattr(result, "url", "")
                )
            ],
                "context": "",
                "errors": ["Empty research question."],
            }

        request = ResearchRequest(
            query=question,
            language=None,
            max_results=max(1, int(max_results)),
            max_pages=max(1, int(max_pages)),
            include_web=True,
            include_wikipedia=True,
            metadata={
                "consumer": "qai_brain",
                "mode": "fallback_research",
            },
        )

        try:
            results = self.researcher.search(
                request
            )

        except Exception as exc:
            return {
                "success": False,
                "query": question,
                "results": [],
                "documents": [],
                "context": "",
                "errors": [
                    f"{type(exc).__name__}: {exc}"
                ],
            }

        if not results:
            return {
                "success": False,
                "query": question,
                "results": [],
                "documents": [],
                "context": "",
                "errors": list(
                    getattr(
                        self.researcher,
                        "last_errors",
                        [],
                    )
                ),
            }

        serialized = [
            self._serialize_result(result)
            for result in results
        ]

        context = self._build_context(results)

        # Research is evidence discovery.
        # It must remain separate from trusted supervisor knowledge.
        documents = []

        for item in serialized:
            documents.append({
                "source": "qai_research",
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "text": item.get("snippet", ""),
                "snippet": item.get("snippet", ""),
                "engine": item.get("engine", ""),
                "rank": item.get("rank", 0),
                "score": item.get("score", 0),
                "approved": False,
                "confidence": 0.0,
                "trusted": False,
            })

        return {
            "success": True,
            "query": question,
            "results": serialized,
            "documents": documents,
            "context": context,
            "errors": list(
                getattr(
                    self.researcher,
                    "last_errors",
                    [],
                )
            ),
        }

    @staticmethod
    def _serialize_result(result) -> Dict[str, Any]:

        return {
            "title": str(
                getattr(result, "title", "")
                or ""
            ),
            "url": str(
                getattr(result, "url", "")
                or ""
            ),
            "snippet": str(
                getattr(result, "snippet", "")
                or ""
            ),
            "engine": str(
                getattr(result, "engine", "")
                or ""
            ),
            "rank": getattr(
                result,
                "rank",
                0,
            ),
            "score": getattr(
                result,
                "score",
                0,
            ),
        }

    @staticmethod
    def _build_context(results: List[Any]) -> str:

        chunks = []

        for index, result in enumerate(
            results,
            1,
        ):
            title = str(
                getattr(result, "title", "")
                or ""
            ).strip()

            url = str(
                getattr(result, "url", "")
                or ""
            ).strip()

            snippet = str(
                getattr(result, "snippet", "")
                or ""
            ).strip()
            # QAI: prefer actual page content over search snippet.
            try:
                _research_url = str(
                    getattr(result, 'url', '') or ''
                ).strip()
            except Exception:
                _research_url = ''

            if _research_url:
                _page_content = _qai_fetch_research_page(
                    _research_url
                )

                if _page_content:
                    snippet = _page_content

            engine = str(
                getattr(result, "engine", "")
                or ""
            ).strip()

            if not snippet:
                continue

            chunks.append(
                "\n".join(
                    [
                        f"[research_source={engine}; rank={index}]",
                        f"title: {title}",
                        f"url: {url}",
                        f"content: {snippet}",
                    ]
                )
            )

        return "\n\n".join(chunks)


research_bridge = ResearchBridge()

import sys
import re
from pathlib import Path
from typing import Any, Dict, List

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from qai_research.core.models import ResearchRequest
from qai_research.core.query_researcher import query_researcher


def _clean_text(value: Any) -> str:
    if not value:
        return ""

    value = str(value).strip()

    value = re.sub(r"\s+", " ", value)

    return value.strip()


def _fetch_url(url: str) -> str:
    """
    Fetch real readable factual content from a research URL.
    Search snippets are NOT treated as final evidence when a URL exists.
    """

    if not url:
        return ""

    try:
        import requests
        from bs4 import BeautifulSoup

        response = requests.get(
            url,
            timeout=20,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Linux; Android 13) "
                    "AppleWebKit/537.36 "
                    "Chrome/120 Safari/537.36"
                )
            },
        )

        if response.status_code != 200:
            print(
                f"[ResearchBridge] fetch status={response.status_code}: {url}"
            )
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
                "aside",
            ]
        ):
            tag.decompose()

        blocks = soup.find_all(
            [
                "article",
                "main",
            ]
        )

        parts = []

        for block in blocks:
            text = block.get_text(
                " ",
                strip=True,
            )

            if text:
                parts.append(text)

        if not parts:
            text = soup.get_text(
                " ",
                strip=True,
            )

            if text:
                parts.append(text)

        content = " ".join(parts)

        content = re.sub(
            r"\s+",
            " ",
            content,
        ).strip()

        if len(content) < 250:
            return ""

        # Keep enough factual context for QAI.
        return content[:20000]

    except Exception as exc:
        print(
            f"[ResearchBridge] page fetch failed: "
            f"{url} :: {exc}"
        )
        return ""


def _extract_result_field(result, name: str) -> str:
    """
    Read fields from either ResearchResult objects or dictionaries.
    """

    if isinstance(result, dict):
        return _clean_text(
            result.get(name, "")
        )

    return _clean_text(
        getattr(result, name, "")
    )


def _result_to_evidence(result) -> Dict[str, Any]:
    """
    Convert researcher output into a clean QAI research document.

    Priority:
        1. Real page content fetched from URL
        2. Existing content field
        3. text field
        4. snippet

    Title is NEVER used as factual content.
    """

    title = _extract_result_field(
        result,
        "title",
    )

    url = _extract_result_field(
        result,
        "url",
    )

    content = _extract_result_field(
        result,
        "content",
    )

    text = _extract_result_field(
        result,
        "text",
    )

    snippet = _extract_result_field(
        result,
        "snippet",
    )

    # ---------------------------------------------------------
    # Remove serialized transport metadata accidentally stored
    # inside content/text/snippet.
    # ---------------------------------------------------------

    def unwrap(value: str) -> str:
        if not value:
            return ""

        value = value.strip()

        match = re.search(
            r"(?:^|\n)\s*content\s*:\s*(.*)",
            value,
            flags=re.IGNORECASE | re.DOTALL,
        )

        if match:
            value = match.group(1).strip()

        value = re.sub(
            r"^\s*(?:title|url|content)\s*:\s*",
            "",
            value,
            flags=re.IGNORECASE,
        )

        value = re.sub(
            r"https?://\S+",
            " ",
            value,
        )

        value = re.sub(
            r"\s+",
            " ",
            value,
        ).strip()

        return value

    content = unwrap(content)
    text = unwrap(text)
    snippet = unwrap(snippet)

    # ---------------------------------------------------------
    # CRITICAL FIX:
    # If a real URL exists, fetch the page instead of trusting
    # the tiny search snippet.
    # ---------------------------------------------------------

    fetched = ""

    if url:
        fetched = _fetch_url(url)

        if fetched:
            print(
                "[ResearchBridge] URL content fetched:",
                len(fetched),
                "chars",
            )

    if fetched:
        factual_content = fetched

    elif content and len(content) >= 250:
        factual_content = content

    elif text and len(text) >= 250:
        factual_content = text

    else:
        factual_content = snippet

    # Never use title as evidence.
    if factual_content.strip() == title.strip():
        factual_content = ""

    return {
        "source": "qai_research",
        "research_source": "qai_research",
        "title": title,
        "url": url,
        "content": factual_content,
        "text": factual_content,
        "snippet": snippet,
        "engine": _extract_result_field(
            result,
            "engine",
        ),
        "rank": (
            result.get("rank")
            if isinstance(result, dict)
            else getattr(result, "rank", None)
        ),
        "score": (
            result.get("score")
            if isinstance(result, dict)
            else getattr(result, "score", None)
        ),
        "approved": False,
        "confidence": 0.0,
        "trusted": False,
    }


def _normalize_document(doc) -> Dict[str, Any]:
    """
    Normalize research documents returned by QueryResearcher.

    QueryResearcher.search() returns SearchResult objects,
    while some callers may return dictionaries.
    Both forms are supported.
    """

    if doc is None:
        return {}

    if isinstance(doc, dict):
        return _result_to_evidence(doc)

    # SearchResult / compatible research result object.
    return _result_to_evidence(doc)


class ResearchBridge:

    def __init__(self, researcher=None):
        self.researcher = (
            researcher
            or query_researcher
        )

    def _fetch_page_content(self, url):
        return _fetch_url(url)

    def _build_research_evidence(
        self,
        title="",
        url="",
        snippet="",
        content="",
    ):
        return _result_to_evidence(
            {
                "title": title,
                "url": url,
                "snippet": snippet,
                "content": content,
            }
        )

    def _research_result_to_evidence(self, result):
        return _result_to_evidence(result)

    def research(
        self,
        question: str,
        max_results: int = 8,
        max_pages: int = 5,
    ) -> Dict[str, Any]:

        question = str(
            question or ""
        ).strip()

        if not question:
            return {
                "success": False,
                "documents": [],
                "context": "",
                "error": "empty question",
            }

        print(
            "[ResearchBridge] researching:",
            question,
        )

        try:
            request = ResearchRequest(
                query=question,
                max_results=max_results,
                max_pages=max_pages,
            )

            raw = self.researcher.search(request)

        except TypeError:
            try:
                raw = self.researcher(
                    question,
                    max_results=max_results,
                    max_pages=max_pages,
                )
            except TypeError:
                raw = self.researcher.search(request)

        except Exception as exc:
            print(
                "[ResearchBridge] researcher failed:",
                exc,
            )

            return {
                "success": False,
                "documents": [],
                "context": "",
                "error": str(exc),
            }

        # -----------------------------------------------------
        # Normalize researcher output.
        # -----------------------------------------------------

        if isinstance(raw, dict):
            raw_documents = (
                raw.get("documents")
                or raw.get("results")
                or []
            )

            if not raw_documents and (
                raw.get("url")
                or raw.get("title")
                or raw.get("snippet")
                or raw.get("text")
            ):
                raw_documents = [raw]

        elif isinstance(raw, (list, tuple)):
            raw_documents = list(raw)

        else:
            raw_documents = []

        documents: List[Dict[str, Any]] = []

        for item in raw_documents:
            try:
                evidence = _normalize_document(item)

                if not evidence:
                    continue

                factual = _clean_text(
                    evidence.get("content")
                )

                if not factual:
                    continue

                documents.append(evidence)

            except Exception as exc:
                print(
                    "[ResearchBridge] document normalization failed:",
                    exc,
                )

        print(
            "[ResearchBridge] normalized documents:",
            len(documents),
        )

        # -----------------------------------------------------
        # Build clean research context.
        # Metadata stays in the document object but NEVER enters
        # the factual context.
        # -----------------------------------------------------

        context_parts = []

        for doc in documents:
            content = _clean_text(
                doc.get("content")
            )

            if not content:
                continue

            context_parts.append(content)

        context = "\n\n".join(
            context_parts
        ).strip()

        print(
            "[ResearchBridge] factual context:",
            len(context),
            "chars",
        )

        return {
            "success": bool(documents),
            "documents": documents,
            "context": context,
            "error": None,
        }


research_bridge = ResearchBridge()

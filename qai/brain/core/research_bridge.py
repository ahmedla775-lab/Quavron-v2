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

    # ---------------------------------------------------------
    # Preserve the original research metadata.
    #
    # SearchResult stores:
    #
    #   relevance
    #
    # directly on the object, while:
    #
    #   relevance_score
    #   relevance_query
    #   query_variant
    #   query_purpose
    #   query_priority
    #
    # are stored inside metadata.
    # ---------------------------------------------------------

    if isinstance(result, dict):
        metadata = dict(result.get("metadata") or {})
        direct_relevance = result.get("relevance")
    else:
        metadata = dict(
            getattr(result, "metadata", {}) or {}
        )
        direct_relevance = getattr(
            result,
            "relevance",
            None,
        )

    relevance_score = metadata.get(
        "relevance_score",
        direct_relevance,
    )

    relevance_query = metadata.get(
        "relevance_query",
    )

    query_variant = metadata.get(
        "query_variant",
    )

    query_purpose = metadata.get(
        "query_purpose",
    )

    query_priority = metadata.get(
        "query_priority",
    )

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

        # Canonical relevance fields used by downstream
        # research / RAG selection.
        "relevance": direct_relevance,
        "relevance_score": relevance_score,
        "relevance_query": relevance_query,
        "query_variant": query_variant,
        "query_purpose": query_purpose,
        "query_priority": query_priority,

        # Preserve complete research metadata.
        "metadata": metadata,

        # Preserve research ranking information for downstream
        # RAG / knowledge selection.
        #
        # QueryResearcher calculates relevance before handing
        # results to this bridge. Losing it here would make the
        # downstream layer unable to distinguish:
        #
        #   exact entity      -> relevance 1.0
        #   related result    -> relevance < 1.0
        #
        # Metadata is kept on the document object and is NOT added
        # to the factual context string.

        "relevance": (
            result.get("relevance")
            if isinstance(result, dict)
            else getattr(result, "relevance", None)
        ),

        "metadata": (
            dict(result.get("metadata") or {})
            if isinstance(result, dict)
            else dict(getattr(result, "metadata", {}) or {})
        ),

        "query_variant": (
            (
                result.get("metadata") or {}
            ).get("query_variant")
            if isinstance(result, dict)
            else (
                getattr(result, "metadata", {}) or {}
            ).get("query_variant")
        ),

        "query_purpose": (
            (
                result.get("metadata") or {}
            ).get("query_purpose")
            if isinstance(result, dict)
            else (
                getattr(result, "metadata", {}) or {}
            ).get("query_purpose")
        ),

        "query_priority": (
            (
                result.get("metadata") or {}
            ).get("query_priority")
            if isinstance(result, dict)
            else (
                getattr(result, "metadata", {}) or {}
            ).get("query_priority")
        ),

        "approved": False,
        "confidence": 0.0,
        "trusted": False,
    }

    # ---------------------------------------------------------
    # Promote research metadata to top-level evidence fields.
    #
    # QueryResearcher stores ranking/relevance information inside
    # SearchResult.metadata.  The downstream QAI/RAG layers should
    # not have to know the internal SearchResult representation.
    # ---------------------------------------------------------

    metadata = evidence.get("metadata") or {}

    # Promote research metadata to top-level fields.
    for key in (
        "relevance_score",
        "relevance_query",
        "query_variant",
        "query_purpose",
        "query_priority",
        "language",
        "pageid",
        "exact_search",
    ):
        if key in metadata:
            evidence[key] = metadata[key]

    # ---------------------------------------------------------
    # Canonical relevance/query fields for downstream QAI/RAG.
    #
    # QueryResearcher stores these values in metadata:
    #
    #   relevance_score
    #   relevance_query
    #
    # Older SearchResult objects may also expose "relevance"
    # directly, so preserve that fallback.
    # ---------------------------------------------------------

    if evidence.get("relevance") is None:
        relevance_score = metadata.get("relevance_score")

        if relevance_score is not None:
            evidence["relevance"] = relevance_score

    if not evidence.get("relevance_query"):
        relevance_query = metadata.get("relevance_query")

        if relevance_query:
            evidence["relevance_query"] = relevance_query

    return evidence


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


def _research_terms(question: str) -> List[str]:
    """
    استخراج كلمات مهمة من سؤال البحث.
    يستخدم فقط لتحديد المقاطع الأكثر صلة،
    ولا يغير سؤال البحث الأصلي.
    """

    value = str(question or "").strip().lower()

    replacements = {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",
        "ة": "ه",
        "ى": "ي",
    }

    for source, target in replacements.items():
        value = value.replace(source, target)

    value = re.sub(
        r"[^\w\s\u0600-\u06ff-]",
        " ",
        value,
    )

    stop_words = {
        "ما", "هو", "هي", "من", "ما", "هل",
        "ماذا", "كيف", "لماذا", "متى", "اين",
        "عن", "في", "من", "الى", "علي", "على",
        "و", "او",
        "the", "what", "is", "are", "who",
        "how", "why", "when", "where",
        "and", "or",
    }

    terms = []

    for word in value.split():
        word = word.strip()

        if len(word) < 2:
            continue

        if word in stop_words:
            continue

        if word not in terms:
            terms.append(word)

    return terms


def _document_research_score(
    question: str,
    document: Dict[str, Any],
) -> float:
    """
    تقييم وثيقة البحث اعتمادًا على:
    - relevance_score
    - score الأصلي
    - تطابق عنوان الوثيقة
    - تطابق كلمات السؤال
    - أولوية query variant
    """

    title = _clean_text(
        document.get("title")
    ).lower()

    content = _clean_text(
        document.get("content")
    ).lower()

    metadata = document.get(
        "metadata",
        {},
    )

    if not isinstance(metadata, dict):
        metadata = {}

    relevance = float(
        metadata.get(
            "relevance_score",
            0.0,
        )
        or 0.0
    )

    original_score = float(
        document.get(
            "score",
            0.0,
        )
        or 0.0
    )

    priority = float(
        metadata.get(
            "query_priority",
            9999,
        )
        or 9999
    )

    terms = _research_terms(question)

    title_hits = 0
    content_hits = 0

    for term in terms:
        if term in title:
            title_hits += 1

        if term in content:
            content_hits += 1

    score = 0.0

    # relevance هو العامل الأساسي.
    score += relevance * 100.0

    # تطابق العنوان مهم جدًا في أسئلة الكيانات.
    score += title_hits * 30.0

    # وجود المصطلحات في المحتوى دعم إضافي.
    score += min(
        content_hits * 3.0,
        30.0,
    )

    # نتيجة البحث الأصلية.
    score += min(
        original_score / 10.0,
        20.0,
    )

    # الأولوية الأقل أفضل.
    if priority < 9999:
        score += max(
            0.0,
            10.0 - priority,
        )

    return round(
        score,
        4,
    )


def _extract_relevant_chunks(
    question: str,
    content: str,
    max_chars: int = 6000,
) -> str:
    """
    استخراج المقاطع الأقرب إلى السؤال بدل تمرير الصفحة كاملة.

    يتم تقسيم المحتوى إلى جمل تقريبية ثم اختيار الجمل
    التي تحتوي على أكبر عدد من كلمات السؤال المهمة.
    """

    content = _clean_text(content)

    if not content:
        return ""

    if len(content) <= max_chars:
        return content

    terms = _research_terms(question)

    if not terms:
        return content[:max_chars]

    # تقسيم تقريبي إلى جمل.
    sentences = re.split(
        r"(?<=[.!؟?])\s+",
        content,
    )

    scored = []

    for index, sentence in enumerate(sentences):
        sentence = sentence.strip()

        if not sentence:
            continue

        normalized = sentence.lower()

        hits = sum(
            1
            for term in terms
            if term in normalized
        )

        # نعطي الأولوية للجمل التي تحتوي على كلمات البحث.
        if hits > 0:
            local_score = (
                hits * 20
                + min(len(sentence) / 500.0, 5.0)
            )

            scored.append(
                (
                    local_score,
                    index,
                    sentence,
                )
            )

    if not scored:
        return content[:max_chars]

    # الأقوى أولًا.
    scored.sort(
        key=lambda item: (
            -item[0],
            item[1],
        )
    )

    selected = []
    total = 0

    for _, _, sentence in scored:
        if total + len(sentence) + 1 > max_chars:
            continue

        selected.append(sentence)
        total += len(sentence) + 1

        if total >= max_chars:
            break

    # إعادة ترتيب المقاطع حسب ظهورها الأصلي في الصفحة.
    selected_set = set(selected)

    ordered = [
        sentence
        for sentence in sentences
        if sentence.strip() in selected_set
    ]

    result = " ".join(ordered).strip()

    return result[:max_chars]


def _select_research_documents(
    question: str,
    documents: List[Dict[str, Any]],
    max_documents: int = 5,
) -> List[Dict[str, Any]]:
    """
    اختيار أفضل الأدلة البحثية قبل بناء السياق النهائي.

    لا نحذف الوثائق من نتيجة البحث الأصلية؛
    هذه المرحلة تخص السياق الذي سيصل إلى QAI فقط.
    """

    scored = []

    for document in documents:
        if not document:
            continue

        research_score = _document_research_score(
            question,
            document,
        )

        item = dict(document)

        metadata = item.get(
            "metadata",
            {},
        )

        if not isinstance(metadata, dict):
            metadata = {}

        metadata = dict(metadata)

        metadata[
            "research_selection_score"
        ] = research_score

        item["metadata"] = metadata

        scored.append(
            (
                research_score,
                item,
            )
        )

    scored.sort(
        key=lambda item: -item[0]
    )

    selected = [
        item
        for _, item in scored[:max_documents]
    ]

    return selected


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
        # Research evidence selection.
        #
        # Do NOT send every fetched page to QAI.
        # Keep the complete normalized documents available,
        # but build the final context from the strongest evidence.
        # -----------------------------------------------------

        selected_documents = _select_research_documents(
            question=question,
            documents=documents,
            max_documents=5,
        )

        print(
            "[ResearchBridge] selected evidence:",
            len(selected_documents),
            "/",
            len(documents),
        )

        context_parts = []

        for index, doc in enumerate(
            selected_documents,
            1,
        ):
            title = _clean_text(
                doc.get("title")
            )

            content = _clean_text(
                doc.get("content")
            )

            if not content:
                continue

            # Keep each evidence chunk bounded.
            chunk = _extract_relevant_chunks(
                question=question,
                content=content,
                max_chars=6000,
            )

            if not chunk:
                continue

            # Title is metadata only for ranking/debugging.
            # It is intentionally NOT injected as factual evidence.
            context_parts.append(
                chunk
            )

            metadata = doc.get(
                "metadata",
                {},
            )

            if isinstance(metadata, dict):
                print(
                    "[ResearchBridge] evidence",
                    index,
                    "| title=",
                    title,
                    "| selection_score=",
                    metadata.get(
                        "research_selection_score",
                        0,
                    ),
                    "| chunk=",
                    len(chunk),
                    "chars",
                )

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

            # All normalized research documents.
            "documents": documents,

            # Strongest evidence selected for the final context.
            "selected_documents": selected_documents,

            # Explicit count for downstream consumers/debugging.
            "document_count": len(documents),
            "selected_count": len(selected_documents),

            # Final factual context built ONLY from selected evidence.
            "context": context,

            "error": None,
        }


research_bridge = ResearchBridge()

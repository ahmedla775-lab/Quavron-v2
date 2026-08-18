from __future__ import annotations

import hashlib
import html
import re
import unicodedata
from dataclasses import dataclass, asdict
from typing import Any, Dict, Iterable, List


@dataclass
class ProcessedKnowledge:
    raw_id: str
    query: str
    title: str
    url: str
    engine: str
    source_type: str

    text: str
    language: str

    quality_score: float
    relevance_score: float
    usefulness_score: float

    status: str
    duplicate: bool

    entities: List[str]
    terms: List[str]

    metadata: Dict[str, Any]


class KnowledgeProcessor:
    """
    يحول المادة الخام إلى مادة معرفية قابلة للمعالجة اللاحقة.

    مهم:
    - لا يحذف RAW.
    - لا يقرر الإجابة النهائية.
    - لا يستبدل RelevanceFilter.
    - ينتج إشارات مستقلة للجودة والصلة والفائدة.
    """

    NOISE_PATTERNS = (
        "cookie",
        "privacy policy",
        "terms of service",
        "terms and conditions",
        "javascript",
        "sign in",
        "login",
        "redirect notice",
        "access denied",
        "page not found",
    )

    ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
    LATIN_RE = re.compile(r"[A-Za-z]")
    JAPANESE_RE = re.compile(r"[\u3040-\u30FF]")
    CJK_RE = re.compile(r"[\u4E00-\u9FFF]")

    WORD_RE = re.compile(
        r"[\w\u0600-\u06FF]+",
        re.UNICODE,
    )

    def __init__(self) -> None:
        self._seen_hashes: set[str] = set()

    # ---------------------------------------------------------
    # Basic extraction
    # ---------------------------------------------------------

    @staticmethod
    def _get(result: Any, key: str, default: Any = "") -> Any:
        if isinstance(result, dict):
            return result.get(key, default)

        return getattr(result, key, default)

    @staticmethod
    def _metadata(result: Any) -> Dict[str, Any]:
        metadata = KnowledgeProcessor._get(result, "metadata", {})
        return dict(metadata) if isinstance(metadata, dict) else {}

    # ---------------------------------------------------------
    # Cleaning
    # ---------------------------------------------------------

    @staticmethod
    def clean_text(value: str) -> str:
        if not value:
            return ""

        text = html.unescape(str(value))

        text = re.sub(
            r"<script\b[^>]*>.*?</script>",
            " ",
            text,
            flags=re.I | re.S,
        )

        text = re.sub(
            r"<style\b[^>]*>.*?</style>",
            " ",
            text,
            flags=re.I | re.S,
        )

        text = re.sub(r"<[^>]+>", " ", text)

        text = unicodedata.normalize("NFKC", text)

        text = re.sub(r"\s+", " ", text)

        return text.strip()

    # ---------------------------------------------------------
    # Language
    # ---------------------------------------------------------

    def detect_language(self, text: str) -> str:
        if not text:
            return "unknown"

        arabic = len(self.ARABIC_RE.findall(text))
        latin = len(self.LATIN_RE.findall(text))
        japanese = len(self.JAPANESE_RE.findall(text))
        cjk = len(self.CJK_RE.findall(text))

        counts = {
            "ar": arabic,
            "en": latin,
            "ja": japanese,
            "zh": cjk,
        }

        language, count = max(
            counts.items(),
            key=lambda item: item[1],
        )

        if count == 0:
            return "unknown"

        return language

    # ---------------------------------------------------------
    # Tokens / terms
    # ---------------------------------------------------------

    def extract_terms(self, text: str, limit: int = 50) -> List[str]:
        if not text:
            return []

        tokens = self.WORD_RE.findall(text.lower())

        stopwords = {
            "من",
            "ما",
            "ماذا",
            "هل",
            "هو",
            "هي",
            "في",
            "من",
            "إلى",
            "على",
            "عن",
            "مع",
            "هذا",
            "هذه",
            "ذلك",
            "تلك",
            "the",
            "and",
            "or",
            "is",
            "are",
            "of",
            "to",
            "in",
            "a",
            "an",
        }

        result = []
        seen = set()

        for token in tokens:
            token = token.strip()

            if len(token) < 2:
                continue

            if token in stopwords:
                continue

            if token in seen:
                continue

            seen.add(token)
            result.append(token)

            if len(result) >= limit:
                break

        return result

    # ---------------------------------------------------------
    # Simple entity candidates
    # ---------------------------------------------------------

    def extract_entities(
        self,
        title: str,
        text: str,
        limit: int = 30,
    ) -> List[str]:

        candidates: List[str] = []

        combined = f"{title} {text}".strip()

        # العربية:
        # نأخذ العبارات المتجاورة التي تبدأ بحروف عربية،
        # ثم نترك مرحلة استخراج الكيانات المتقدمة لاحقًا.
        arabic_phrases = re.findall(
            r"[\u0600-\u06FF][\u0600-\u06FF0-9_-]{1,}(?:\s+[\u0600-\u06FF][\u0600-\u06FF0-9_-]{1,}){0,3}",
            combined,
        )

        candidates.extend(arabic_phrases)

        # الإنجليزية / الأسماء متعددة الكلمات
        english_phrases = re.findall(
            r"\b[A-Z][A-Za-z0-9_-]{1,}"
            r"(?:\s+[A-Z][A-Za-z0-9_-]{1,}){0,3}\b",
            combined,
        )

        candidates.extend(english_phrases)

        result = []
        seen = set()

        for item in candidates:
            item = re.sub(r"\s+", " ", item).strip()

            if len(item) < 2:
                continue

            key = item.casefold()

            if key in seen:
                continue

            seen.add(key)
            result.append(item)

            if len(result) >= limit:
                break

        return result

    # ---------------------------------------------------------
    # Duplicate detection
    # ---------------------------------------------------------

    @staticmethod
    def fingerprint(title: str, text: str) -> str:
        normalized = re.sub(
            r"\s+",
            " ",
            f"{title} {text}".strip().lower(),
        )

        return hashlib.sha256(
            normalized.encode("utf-8")
        ).hexdigest()

    # ---------------------------------------------------------
    # Quality
    # ---------------------------------------------------------

    def quality_score(
        self,
        title: str,
        text: str,
        url: str,
    ) -> float:

        score = 0.0

        if title:
            score += 0.20

        if text:
            score += 0.25

        if len(text) >= 100:
            score += 0.15

        if len(text) >= 300:
            score += 0.15

        if len(text) >= 1000:
            score += 0.10

        if url.startswith(("http://", "https://")):
            score += 0.10

        lowered = text.lower()

        for pattern in self.NOISE_PATTERNS:
            if pattern in lowered:
                score -= 0.10

        return round(max(0.0, min(score, 1.0)), 4)

    # ---------------------------------------------------------
    # Query relevance
    # ---------------------------------------------------------

    def relevance_score(
        self,
        query: str,
        title: str,
        text: str,
        query_variants=None,
    ) -> float:
        """
        حساب صلة المادة البحثية بالسؤال الأصلي وصيغه المشروعة.

        السؤال الأصلي يبقى الإشارة الأساسية.
        Query variants يمكن أن تكون:
        - multilingual
        - entity-focused
        - quoted
        - reformulated
        - topic-focused

        لا يتم حذف المادة هنا.
        هذه مجرد إشارة تستخدم لاحقًا في التصنيف.
        """

        candidate_queries = [
            str(query or "").strip()
        ]

        for variant in (query_variants or []):
            variant = str(variant or "").strip()

            if variant and variant not in candidate_queries:
                candidate_queries.append(variant)

        best_score = 0.0

        title_tokens = set(
            self.extract_terms(title)
        )

        text_tokens = set(
            self.extract_terms(text)
        )

        for candidate_query in candidate_queries:
            query_tokens = set(
                self.extract_terms(candidate_query)
            )

            if not query_tokens:
                continue

            title_hits = len(
                query_tokens & title_tokens
            )

            text_hits = len(
                query_tokens & text_tokens
            )

            title_ratio = (
                title_hits / len(query_tokens)
            )

            text_ratio = (
                text_hits / len(query_tokens)
            )

            score = (
                title_ratio * 0.70
                + text_ratio * 0.30
            )

            score = round(
                max(0.0, min(score, 1.0)),
                4,
            )

            if score > best_score:
                best_score = score

        return best_score

    # ---------------------------------------------------------
    # Final classification
    # ---------------------------------------------------------

    def classify(
        self,
        quality: float,
        relevance: float,
        duplicate: bool,
    ) -> str:

        if duplicate:
            return "duplicate"

        if quality < 0.15:
            return "noise"

        if relevance >= 0.50 and quality >= 0.30:
            return "usable"

        if relevance >= 0.15 and quality >= 0.20:
            return "weak"

        return "noise"

    # ---------------------------------------------------------
    # Process one document
    # ---------------------------------------------------------

    def process(self, result: Any) -> ProcessedKnowledge:

        query = str(
            self._get(result, "query", "")
            or self._metadata(result).get("query", "")
        )

        title = self.clean_text(
            str(self._get(result, "title", "") or "")
        )

        url = str(
            self._get(result, "url", "") or ""
        ).strip()

        snippet = self.clean_text(
            str(self._get(result, "snippet", "") or "")
        )

        content = self.clean_text(
            str(self._get(result, "content", "") or "")
        )

        text = content or snippet

        engine = str(
            self._get(result, "engine", "")
            or self._metadata(result).get("engine", "")
            or ""
        )

        metadata = self._metadata(result)

        source_type = str(
            self._get(result, "source_type", "")
            or metadata.get("source_type", "")
            or "unknown"
        )

        raw_id = str(
            self._get(result, "raw_id", "")
            or self._get(result, "id", "")
            or metadata.get("raw_id", "")
            or ""
        ).strip()

        if not raw_id:
            raw_id = self.fingerprint(title, text)

        fingerprint = self.fingerprint(title, text)

        duplicate = fingerprint in self._seen_hashes

        self._seen_hashes.add(fingerprint)

        language = self.detect_language(
            f"{title} {text}"
        )

        quality = self.quality_score(
            title,
            text,
            url,
        )

        query_variants = metadata.get(
            "query_variants",
            [],
        )

        if isinstance(query_variants, str):
            query_variants = [query_variants]

        relevance = self.relevance_score(
            query,
            title,
            text,
            query_variants=query_variants,
        )

        usefulness = round(
            quality * 0.45
            + relevance * 0.55,
            4,
        )

        status = self.classify(
            quality,
            relevance,
            duplicate,
        )

        metadata.update(
            {
                "raw_id": raw_id,
                "source_type": source_type,
                "fingerprint": fingerprint,
                "source_status": status,
                "quality_score": quality,
                "relevance_score": relevance,
                "usefulness_score": usefulness,
                "processing_stage": "processed_knowledge",
                "knowledge_ready": status == "usable" and not duplicate,
            }
        )

        return ProcessedKnowledge(
            raw_id=raw_id,
            query=query,
            title=title,
            url=url,
            engine=engine,
            source_type=source_type,
            text=text,
            language=language,
            quality_score=quality,
            relevance_score=relevance,
            usefulness_score=usefulness,
            status=status,
            duplicate=duplicate,
            entities=self.extract_entities(
                title,
                text,
            ),
            terms=self.extract_terms(text),
            metadata=metadata,
        )

    # ---------------------------------------------------------
    # Process many
    # ---------------------------------------------------------

    def process_many(
        self,
        results: Iterable[Any],
    ) -> List[ProcessedKnowledge]:

        return [
            self.process(result)
            for result in results
        ]

    # ---------------------------------------------------------
    # JSON-compatible output
    # ---------------------------------------------------------

    @staticmethod
    def to_dict(
        item: ProcessedKnowledge,
    ) -> Dict[str, Any]:

        return asdict(item)

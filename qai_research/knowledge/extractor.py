from __future__ import annotations

import hashlib
import re
from typing import Any, Iterable, List

from qai_research.ingestion.raw_models import RawKnowledge

from .models import KnowledgeItem


class KnowledgeExtractor:
    """
    يحول المادة الخام المعالجة إلى KnowledgeItem.

    هذه المرحلة لا تقدم إجابة للمستخدم.
    إنها تبني معرفة مشتقة يمكن لـQAI استخدامها لاحقًا.

    RAW يبقى محفوظًا دائمًا.
    """

    ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
    LATIN_RE = re.compile(r"[A-Za-z]")

    SENTENCE_RE = re.compile(
        r"(?<=[.!?؟؛])\s+|\n+"
    )

    WORD_RE = re.compile(
        r"[\w\u0600-\u06FF]+",
        re.UNICODE,
    )

    STOPWORDS = {
        "من", "ما", "ماذا", "هل", "هو", "هي",
        "في", "إلى", "على", "عن", "مع",
        "هذا", "هذه", "ذلك", "تلك",
        "the", "and", "or", "is", "are",
        "of", "to", "in", "a", "an",
        "for", "with", "that", "this",
    }

    def __init__(self) -> None:
        pass

    # ---------------------------------------------------------
    # Language
    # ---------------------------------------------------------

    def detect_language(self, text: str) -> str:

        if not text:
            return "unknown"

        arabic = len(
            self.ARABIC_RE.findall(text)
        )

        latin = len(
            self.LATIN_RE.findall(text)
        )

        if arabic > latin:
            return "ar"

        if latin > arabic:
            return "en"

        return "unknown"

    # ---------------------------------------------------------
    # Terms
    # ---------------------------------------------------------

    def extract_terms(
        self,
        text: str,
        limit: int = 100,
    ) -> List[str]:

        if not text:
            return []

        tokens = self.WORD_RE.findall(
            text.lower()
        )

        result: List[str] = []
        seen = set()

        for token in tokens:

            if len(token) < 2:
                continue

            if token in self.STOPWORDS:
                continue

            if token in seen:
                continue

            seen.add(token)
            result.append(token)

            if len(result) >= limit:
                break

        return result

    # ---------------------------------------------------------
    # Entities
    # ---------------------------------------------------------

    def extract_entities(
        self,
        title: str,
        text: str,
        limit: int = 50,
    ) -> List[str]:

        combined = (
            f"{title} {text}"
        ).strip()

        if not combined:
            return []

        candidates: List[str] = []

        # Arabic phrases
        candidates.extend(
            re.findall(
                r"[\u0600-\u06FF][\u0600-\u06FF0-9_-]{1,}"
                r"(?:\s+[\u0600-\u06FF][\u0600-\u06FF0-9_-]{1,}){0,3}",
                combined,
            )
        )

        # English proper-name candidates
        candidates.extend(
            re.findall(
                r"\b[A-Z][A-Za-z0-9_-]{1,}"
                r"(?:\s+[A-Z][A-Za-z0-9_-]{1,}){0,3}\b",
                combined,
            )
        )

        result = []
        seen = set()

        for candidate in candidates:

            candidate = re.sub(
                r"\s+",
                " ",
                candidate,
            ).strip()

            if len(candidate) < 2:
                continue

            key = candidate.casefold()

            if key in seen:
                continue

            seen.add(key)
            result.append(candidate)

            if len(result) >= limit:
                break

        return result

    # ---------------------------------------------------------
    # Candidate facts
    # ---------------------------------------------------------

    def extract_facts(
        self,
        text: str,
        limit: int = 30,
    ) -> List[str]:

        if not text:
            return []

        sentences = self.SENTENCE_RE.split(
            text
        )

        facts: List[str] = []

        for sentence in sentences:

            sentence = sentence.strip()

            if len(sentence) < 30:
                continue

            # لا ندعي أن الجملة حقيقة مؤكدة.
            # نسميها candidate fact حتى تمر لاحقًا
            # بمرحلة التحقق والثقة.
            facts.append(sentence)

            if len(facts) >= limit:
                break

        return facts

    # ---------------------------------------------------------
    # Concepts
    # ---------------------------------------------------------

    def extract_concepts(
        self,
        terms: List[str],
        entities: List[str],
        limit: int = 50,
    ) -> List[str]:

        result = []

        for value in entities + terms:

            value = str(value).strip()

            if not value:
                continue

            if value in result:
                continue

            result.append(value)

            if len(result) >= limit:
                break

        return result

    # ---------------------------------------------------------
    # Confidence
    # ---------------------------------------------------------

    def calculate_confidence(
        self,
        raw: RawKnowledge,
        text: str,
        facts: List[str],
        entities: List[str],
    ) -> float:

        score = 0.0

        if raw.title:
            score += 0.15

        if raw.url.startswith(
            ("http://", "https://")
        ):
            score += 0.10

        if len(text) >= 100:
            score += 0.15

        if len(text) >= 500:
            score += 0.15

        if len(text) >= 2000:
            score += 0.15

        if facts:
            score += 0.15

        if entities:
            score += 0.15

        return round(
            min(score, 1.0),
            4,
        )

    # ---------------------------------------------------------
    # Main extraction
    # ---------------------------------------------------------

    @staticmethod
    def _get(value: Any, key: str, default: Any = "") -> Any:
        if isinstance(value, dict):
            return value.get(key, default)
        return getattr(value, key, default)

    def extract(
        self,
        raw: Any,
    ) -> KnowledgeItem:
        """
        تحويل المادة الخام أو المادة المعالجة إلى KnowledgeItem.

        يقبل:
        - RawKnowledge
        - ProcessedKnowledge
        - dict متوافق مع الحقول

        لا يحذف RAW ولا يقرر الحقيقة النهائية.
        """

        query = str(self._get(raw, "query", "") or "")
        title = str(self._get(raw, "title", "") or "")
        url = str(self._get(raw, "url", "") or "")
        raw_id = str(self._get(raw, "raw_id", "") or "")

        content = str(self._get(raw, "content", "") or "")
        snippet = str(self._get(raw, "snippet", "") or "")
        source_text = str(self._get(raw, "text", "") or "")

        text = (
            source_text.strip()
            or content.strip()
            or snippet.strip()
        )

        engine = str(
            self._get(raw, "engine", "")
            or self._get(raw, "source_engine", "")
            or ""
        )

        source_type = str(
            self._get(raw, "source_type", "")
            or ""
        )

        metadata = self._get(raw, "metadata", {}) or {}
        metadata = dict(metadata) if isinstance(metadata, dict) else {}

        language = str(
            self._get(raw, "language", "")
            or self.detect_language(text)
            or "unknown"
        )

        terms = self.extract_terms(text)

        entities = self.extract_entities(
            title,
            text,
        )

        facts = self.extract_facts(text)

        concepts = self.extract_concepts(
            terms,
            entities,
        )

        # ---------------------------------------------------------
        # Scores القادمة من KnowledgeProcessor إن وجدت
        # ---------------------------------------------------------

        quality_score = float(
            self._get(raw, "quality_score", 0.0) or 0.0
        )

        relevance_score = float(
            self._get(raw, "relevance_score", 0.0) or 0.0
        )

        usefulness_score = float(
            self._get(raw, "usefulness_score", 0.0) or 0.0
        )

        # إذا كان المصدر RAW ولم تتم معالجته بعد، نحسب confidence
        # من محتوى المادة كما في النظام القديم.
        confidence = self.calculate_confidence(
            raw,
            text,
            facts,
            entities,
        )

        # إذا كان Processor قد أعطى usefulness_score،
        # نستخدمه كإشارة إضافية للثقة.
        if usefulness_score > 0.0:
            confidence = round(
                min(
                    1.0,
                    (confidence * 0.50)
                    + (usefulness_score * 0.50),
                ),
                4,
            )

        fingerprint = (
            f"{raw_id}\n"
            f"{url}\n"
            f"{text}"
        )

        knowledge_id = hashlib.sha256(
            fingerprint.encode("utf-8")
        ).hexdigest()

        metadata.update(
            {
                "extraction_stage": "candidate_knowledge",
                "fact_count": len(facts),
                "entity_count": len(entities),
                "term_count": len(terms),
                "concept_count": len(concepts),
                "quality_score": quality_score,
                "relevance_score": relevance_score,
                "usefulness_score": usefulness_score,
                "confidence": confidence,
                "source_type": source_type,
            }
        )

        return KnowledgeItem(
            knowledge_id=knowledge_id,
            raw_id=raw_id,
            query=query,
            title=title,
            url=url,
            source_type=source_type,
            engine=engine,
            language=language,
            facts=facts,
            entities=entities,
            terms=terms,
            concepts=concepts,
            source_text=text,
            quality_score=quality_score,
            confidence=confidence,
            metadata=metadata,
        )

    # ---------------------------------------------------------
    # Many
    # ---------------------------------------------------------

    def extract_many(
        self,
        items: Iterable[RawKnowledge],
    ) -> List[KnowledgeItem]:

        return [
            self.extract(item)
            for item in items
        ]

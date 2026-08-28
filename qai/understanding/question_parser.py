"""
QAI Understanding Layer
Question Parser

Final standalone parser for converting a natural-language question into
structured understanding data.

This module does NOT modify:
- intent/router.py
- reasoning/reasoning.py
- rag/
- brain/
- llm/

Integration will happen only after the complete understanding layer passes
its integration tests.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Optional understanding modules
# ---------------------------------------------------------------------------

try:
    from .normalization import normalize_text
except Exception:
    def normalize_text(value: Any) -> str:
        text = str(value or "")
        text = re.sub(r"\s+", " ", text).strip()
        return text


try:
    from .language import detect_language
except Exception:
    def detect_language(value: Any) -> str:
        text = str(value or "")
        if re.search(r"[\u0600-\u06FF]", text):
            return "ar"
        if re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", text):
            return "en"
        return "unknown"


try:
    from .entities import extract_entities
except Exception:
    def extract_entities(value: Any) -> List[Dict[str, Any]]:
        return []


try:
    from .relations import extract_relations
except Exception:
    def extract_relations(value: Any) -> List[Dict[str, Any]]:
        return []


try:
    from .temporal import extract_temporal
except Exception:
    try:
        from .temporal import analyze_temporal as extract_temporal
    except Exception:
        try:
            from .temporal import parse_temporal as extract_temporal
        except Exception:
            def extract_temporal(value: Any) -> Any:
                return []


try:
    from .numbers import extract_numbers
except Exception:
    def extract_numbers(value: Any) -> Any:
        return []


try:
    from .locations import extract_locations
except Exception:
    def extract_locations(value: Any) -> List[Dict[str, Any]]:
        return []


try:
    from .question_types import detect_question_type
except Exception:
    def detect_question_type(value: Any) -> str:
        return "general"


try:
    from .intent import detect_intent
except Exception:
    def detect_intent(value: Any) -> Dict[str, Any]:
        return {
            "intent": "general",
            "confidence": 0.0,
        }


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class ParsedQuestion:
    original: str
    normalized: str
    language: str
    question_type: str
    intent: str
    intent_confidence: float
    entities: List[Dict[str, Any]]
    relations: List[Dict[str, Any]]
    temporal: Any
    numbers: Any
    locations: List[Dict[str, Any]]
    subject: Optional[str]
    target: Optional[str]
    keywords: List[str]
    is_question: bool
    question_markers: List[str]
    confidence: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# Question markers
# ---------------------------------------------------------------------------

ARABIC_QUESTION_MARKERS = (
    "ما",
    "ماذا",
    "من",
    "متى",
    "أين",
    "اين",
    "كيف",
    "لماذا",
    "لِماذا",
    "هل",
    "كم",
    "أي",
    "اي",
    "أيه",
    "ايه",
    "أينما",
)

ENGLISH_QUESTION_MARKERS = (
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "which",
    "whose",
    "whom",
)

FRENCH_QUESTION_MARKERS = (
    "quoi",
    "que",
    "qui",
    "quand",
    "où",
    "ou",
    "pourquoi",
    "comment",
    "quel",
    "quelle",
    "quels",
    "quelles",
)


# ---------------------------------------------------------------------------
# Question type helpers
# ---------------------------------------------------------------------------

def _safe_lower(value: Any) -> str:
    return str(value or "").strip().lower()


def _detect_question_markers(text: str) -> List[str]:
    normalized = _safe_lower(text)
    found: List[str] = []

    for marker in (
        ARABIC_QUESTION_MARKERS
        + ENGLISH_QUESTION_MARKERS
        + FRENCH_QUESTION_MARKERS
    ):
        if not marker:
            continue

        pattern = rf"(?<!\w){re.escape(marker)}(?!\w)"

        if re.search(pattern, normalized, flags=re.IGNORECASE):
            found.append(marker)

    return found


def _is_question(text: str, markers: List[str]) -> bool:
    if "؟" in text or "?" in text:
        return True

    if markers:
        return True

    normalized = _safe_lower(text)

    question_starts = (
        "هل ",
        "ما ",
        "ماذا ",
        "من ",
        "متى ",
        "أين ",
        "اين ",
        "كيف ",
        "لماذا ",
        "what ",
        "who ",
        "when ",
        "where ",
        "why ",
        "how ",
        "quelle ",
        "quel ",
        "quand ",
        "pourquoi ",
        "comment ",
    )

    return normalized.startswith(question_starts)


# ---------------------------------------------------------------------------
# Token and keyword extraction
# ---------------------------------------------------------------------------

_STOP_WORDS = {
    # Arabic
    "ما",
    "ماذا",
    "من",
    "متى",
    "أين",
    "اين",
    "كيف",
    "لماذا",
    "هل",
    "كم",
    "أي",
    "اي",
    "هي",
    "هو",
    "هل",
    "في",
    "من",
    "إلى",
    "الى",
    "عن",
    "على",
    "مع",
    "و",
    "يا",
    "هذا",
    "هذه",
    "ذلك",
    "تلك",

    # English
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "is",
    "are",
    "the",
    "a",
    "an",
    "of",
    "in",
    "to",
    "for",
    "and",
    "or",
    "with",

    # French
    "que",
    "quoi",
    "qui",
    "quand",
    "où",
    "ou",
    "pourquoi",
    "comment",
    "le",
    "la",
    "les",
    "un",
    "une",
    "de",
    "du",
    "des",
    "en",
    "et",
    "ou",
}


def _tokenize(text: str) -> List[str]:
    return re.findall(
        r"[\u0600-\u06FF]+|[A-Za-zÀ-ÖØ-öø-ÿ]+|\d+(?:[.,]\d+)?",
        text,
        flags=re.UNICODE,
    )


def _extract_keywords(text: str) -> List[str]:
    tokens = _tokenize(text)
    keywords: List[str] = []
    seen = set()

    for token in tokens:
        normalized = token.strip().lower()

        if not normalized:
            continue

        if normalized in _STOP_WORDS:
            continue

        if len(normalized) < 2:
            continue

        if normalized in seen:
            continue

        seen.add(normalized)
        keywords.append(token)

    return keywords


# ---------------------------------------------------------------------------
# Subject / target extraction
# ---------------------------------------------------------------------------

def _clean_phrase(value: str) -> str:
    value = str(value or "")
    value = re.sub(r"\s+", " ", value)

    # Remove only actual surrounding whitespace/punctuation.
    # Do NOT remove Latin letters or Arabic letters from the phrase.
    value = value.strip()
    value = value.strip(
        ".,،؛;:!?؟()[]{}<>\\\"'`“”‘’«»"
    )
    value = value.strip()

    return value


def _extract_comparison_targets(text: str) -> Dict[str, Optional[str]]:
    """Extract left/right operands from common comparison phrasing."""

    value = str(text or "").strip()

    # ---------------------------------------------------------------
    # Arabic
    # ---------------------------------------------------------------
    arabic = re.search(
        r"(?:ما\s+)?الفرق\s+بين\s+(.+)",
        value,
        flags=re.IGNORECASE,
    )

    if arabic:
        body = arabic.group(1).strip()

        # Remove only terminal punctuation.
        body = body.rstrip("؟?!,،;؛.")

        # Find the Arabic conjunction "و".
        #
        # We deliberately require either:
        #   whitespace + و + optional whitespace
        # OR
        #   whitespace + و directly attached to the right operand.
        #
        # This prevents matching the "و" inside:
        #   للابتوب
        #   الحاسوب
        #   للمكتبي
        separator = re.search(
            r"\s+و(?:َ)?(?=\s*[\w\u0600-\u06FF])",
            body,
            flags=re.IGNORECASE,
        )

        if separator:
            left = body[:separator.start()].strip()
            right = body[separator.end():].strip()

            # If there is whitespace after the conjunction,
            # remove it without touching the operand itself.
            right = right.lstrip()

            left = _clean_phrase(left)
            right = _clean_phrase(right)

            if left and right:
                return {
                    "left": left,
                    "right": right,
                }

    # ---------------------------------------------------------------
    # English
    # ---------------------------------------------------------------
    m = re.search(
        r"(?:difference|differences)\s+between\s+"
        r"(?P<left>.+?)\s+and\s+"
        r"(?P<right>.+?)(?:[?!,.;]\s*)?$",
        value,
        flags=re.IGNORECASE,
    )

    if m:
        return {
            "left": _clean_phrase(m.group("left")) or None,
            "right": _clean_phrase(m.group("right")) or None,
        }

    # ---------------------------------------------------------------
    # French
    # ---------------------------------------------------------------
    m = re.search(
        r"(?:différence|differences?)\s+entre\s+"
        r"(?P<left>.+?)\s+et\s+"
        r"(?P<right>.+?)(?:[?!,.;]\s*)?$",
        value,
        flags=re.IGNORECASE,
    )

    if m:
        return {
            "left": _clean_phrase(m.group("left")) or None,
            "right": _clean_phrase(m.group("right")) or None,
        }

    return {
        "left": None,
        "right": None,
    }

def _extract_subject(text: str) -> Optional[str]:
    """
    Conservative subject extraction.

    This is deliberately heuristic; the semantic entity layer remains the
    authoritative source for entities.
    """
    patterns = (
        # Arabic definition questions
        r"ما\s+(?:هو|هي)\s+(.+?)(?:[؟?!]|$)",
        r"من\s+هو\s+(.+?)(?:[؟?!]|$)",
        r"من\s+هي\s+(.+?)(?:[؟?!]|$)",

        # Arabic location questions
        r"ما\s+عاصمة\s+(.+?)(?:[؟?!]|$)",
        r"ما\s+عدد\s+سكان\s+(.+?)(?:[؟?!]|$)",

        # English
        r"what\s+is\s+(.+?)(?:[?!]|$)",
        r"who\s+is\s+(.+?)(?:[?!]|$)",
        r"where\s+is\s+(.+?)(?:[?!]|$)",
    )

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        value = _clean_phrase(match.group(1))

        if value:
            return value

    return None


def _extract_target(text: str) -> Optional[str]:
    patterns = (
        r"عاصمة\s+(.+?)(?:[؟?!]|$)",
        r"سكان\s+(.+?)(?:[؟?!]|$)",
        r"في\s+(.+?)(?:[؟?!]|$)",
        # Do not treat "من بنى X؟" as target="بنى X".
        # The built_by relation supplies X as the subject.
        r"من\s+(?!(?:هو|هي)\b|(?:بنى|قام\s+ببناء|أسس|اسس|أنشأ|انشأ|اخترع|اكتشف)\b)(.+?)(?:[؟?!]|$)",
        r"إلى\s+(.+?)(?:[؟?!]|$)",
        r"الى\s+(.+?)(?:[؟?!]|$)",

        r"capital\s+of\s+(.+?)(?:[?!]|$)",
        r"population\s+of\s+(.+?)(?:[?!]|$)",
        r"in\s+(.+?)(?:[?!]|$)",
    )

    for pattern in patterns:
        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        value = _clean_phrase(match.group(1))

        if value:
            return value

    return None


# ---------------------------------------------------------------------------
# Intent extraction normalization
# ---------------------------------------------------------------------------

def _normalize_intent_result(
    result: Any,
) -> Dict[str, Any]:
    if isinstance(result, str):
        return {
            "intent": result,
            "confidence": 0.0,
        }

    if not isinstance(result, dict):
        return {
            "intent": "general",
            "confidence": 0.0,
        }

    intent = (
        result.get("intent")
        or result.get("type")
        or result.get("name")
        or "general"
    )

    try:
        confidence = float(
            result.get("confidence", 0.0) or 0.0
        )
    except Exception:
        confidence = 0.0

    return {
        **result,
        "intent": str(intent),
        "confidence": max(
            0.0,
            min(1.0, confidence),
        ),
    }


# ---------------------------------------------------------------------------
# Safe module adapters
# ---------------------------------------------------------------------------

def _safe_call(
    function: Any,
    text: str,
    default: Any,
) -> Any:
    try:
        result = function(text)

        if result is None:
            return default

        return result

    except Exception:
        return default


def _as_list(value: Any) -> List[Any]:
    if value is None:
        return []

    if isinstance(value, list):
        return value

    if isinstance(value, tuple):
        return list(value)

    if isinstance(value, set):
        return list(value)

    return [value]


# ---------------------------------------------------------------------------
# Main parser
# ---------------------------------------------------------------------------

class QuestionParser:
    """
    Structured natural-language question parser.

    The parser orchestrates the understanding submodules but does not own
    their semantic logic.
    """

    version = "1.0.0"

    def __init__(self) -> None:
        self.version = self.__class__.version

    def parse(
        self,
        question: Any,
    ) -> Dict[str, Any]:
        original = str(question or "").strip()

        if not original:
            return self._empty_result()

        normalized = _safe_call(
            normalize_text,
            original,
            original,
        )

        if not isinstance(normalized, str):
            normalized = original

        normalized = normalized.strip()

        language_result = _safe_call(
            detect_language,
            normalized,
            "unknown",
        )

        if isinstance(language_result, dict):
            language = str(
                language_result.get("language")
                or language_result.get("code")
                or "unknown"
            )
        else:
            language = str(
                language_result or "unknown"
            )

        question_markers = _detect_question_markers(
            normalized
        )

        is_question = _is_question(
            normalized,
            question_markers,
        )

        question_type_result = _safe_call(
            detect_question_type,
            original,
            "general",
        )

        if isinstance(question_type_result, dict):
            question_type = str(
                question_type_result.get("type")
                or question_type_result.get("question_type")
                or "general"
            )
        else:
            question_type = str(
                question_type_result or "general"
            )

        if not isinstance(question_type_result, dict):
            question_type_result = {
                "type": question_type,
                "confidence": 0.0,
                "markers": [],
                "candidates": [],
            }

        intent_result = _normalize_intent_result(
            _safe_call(
                detect_intent,
                original,
                {"intent": "general", "confidence": 0.0},
            )
        )

        # Semantic extraction must use the original text.
        # normalization.py may perform lossy Arabic character normalization
        # (e.g. ة/ه, إ/ا, ي/ى), which can damage entity/relation values.
        entities = _as_list(
            _safe_call(
                extract_entities,
                original,
                [],
            )
        )

        relations = _as_list(
            _safe_call(
                extract_relations,
                original,
                [],
            )
        )
        # Relation-aware entity cleanup:
        # The relation extractor is authoritative for relation semantics.
        #
        # Example:
        #   "من بنى برج إيفل؟"
        #
        # relation:
        #   built_by(subject="برج إيفل")
        #
        # The entity detector may incorrectly produce:
        #   "بنى برج إيفل"
        #
        # Remove only that erroneous relation-derived entity.

        if relations:
            for relation in relations:
                if not isinstance(relation, dict):
                    continue

                relation_name = str(
                    relation.get("relation") or ""
                ).strip()

                relation_subject = _clean_phrase(
                    str(relation.get("subject") or "")
                )

                if relation_name != "built_by":
                    continue

                if not relation_subject:
                    continue

                cleaned_entities = []

                for entity in entities:
                    # Entity may be either:
                    #   - a dict
                    #   - an Entity dataclass/object
                    #
                    # The cleanup must support both forms.

                    if isinstance(entity, dict):
                        raw_entity_text = entity.get("text") or ""
                    else:
                        raw_entity_text = getattr(
                            entity,
                            "text",
                            "",
                        )

                    entity_text = _clean_phrase(
                        str(raw_entity_text)
                    )

                    # Remove only erroneous entities such as:
                    #   "بنى برج إيفل"
                    #   "قام ببناء برج إيفل"
                    #
                    # The relation extractor remains authoritative:
                    #   built_by(subject="برج إيفل")

                    is_erroneous_built_entity = (
                        relation_subject in entity_text
                        and (
                            entity_text.startswith("بنى ")
                            or entity_text.startswith("قام ببناء ")
                        )
                    )

                    if is_erroneous_built_entity:
                        continue

                    cleaned_entities.append(entity)

                entities = cleaned_entities

        temporal = _safe_call(
            extract_temporal,
            original,
            [],
        )

        numbers = _safe_call(
            extract_numbers,
            original,
            [],
        )

        locations = _as_list(
            _safe_call(
                extract_locations,
                original,
                [],
            )
        )

        # Subject/target are semantic fields too, so preserve the
        # original Arabic spelling instead of using the lossy normalized text.
        subject = _extract_subject(original)
        target = _extract_target(original)

        # Relations are a stronger semantic signal than the generic
        # subject/target heuristics. Use them as a conservative fallback.
        if relations:
            primary_relation = relations[0]

            if isinstance(primary_relation, dict):
                relation_name = str(
                    primary_relation.get("relation") or ""
                ).strip()

                relation_subject = _clean_phrase(
                    str(primary_relation.get("subject") or "")
                )

                relation_object = _clean_phrase(
                    str(primary_relation.get("object") or "")
                )

                if relation_name in {
                    "located_in",
                    "built_by",
                }:
                    if relation_subject:
                        subject = relation_subject

                elif relation_name in {
                    "capital_of",
                    "population_of",
                }:
                    # Example:
                    #   ما عاصمة فرنسا؟
                    #   كم عدد سكان فرنسا؟
                    #
                    # The country is the relation object/target.
                    subject = None

                    if relation_object:
                        target = relation_object

                elif relation_subject and not subject:
                    subject = relation_subject

                if relation_object and not target:
                    target = relation_object

        comparison_targets = _extract_comparison_targets(original)
        keywords = _extract_keywords(normalized)

        confidence = self._calculate_confidence(
            is_question=is_question,
            language=language,
            question_type=question_type,
            intent_confidence=float(
                intent_result.get("confidence", 0.0)
                or 0.0
            ),
            entities=entities,
            locations=locations,
            keywords=keywords,
        )

        parsed = ParsedQuestion(
            original=original,
            normalized=normalized,
            language=language,
            question_type=question_type,
            intent=str(
                intent_result.get(
                    "intent",
                    "general",
                )
            ),
            intent_confidence=float(
                intent_result.get(
                    "confidence",
                    0.0,
                )
                or 0.0
            ),
            entities=entities,
            relations=relations,
            temporal=temporal,
            numbers=numbers,
            locations=locations,
            subject=subject,
            target=target,
            keywords=keywords,
            is_question=is_question,
            question_markers=question_markers,
            confidence=confidence,
        )

        result = parsed.to_dict()

        # Keep the complete raw intent result available for future integration.
        result["intent_result"] = intent_result
        result["question_type_result"] = question_type_result
        result["comparison_targets"] = comparison_targets

        # Compact metadata useful to Brain/RAG later.
        result["meta"] = {
            "parser": "question_parser",
            "version": self.version,
            "has_entities": bool(entities),
            "has_relations": bool(relations),
            "has_temporal": bool(
                temporal.get("has_temporal_information", False)
                if isinstance(temporal, dict)
                else temporal
            ),
            "has_numbers": bool(numbers),
            "has_locations": bool(locations),
            "keyword_count": len(keywords),
        }

        return result

    def _empty_result(self) -> Dict[str, Any]:
        return {
            "original": "",
            "normalized": "",
            "language": "unknown",
            "question_type": "general",
            "intent": "general",
            "intent_confidence": 0.0,
            "entities": [],
            "relations": [],
            "temporal": [],
            "numbers": [],
            "locations": [],
            "subject": None,
            "target": None,
            "keywords": [],
            "is_question": False,
            "question_markers": [],
            "confidence": 0.0,
            "intent_result": {
                "intent": "general",
                "confidence": 0.0,
            },
            "meta": {
                "parser": "question_parser",
                "version": self.version,
                "has_entities": False,
                "has_relations": False,
                "has_temporal": False,
                "has_numbers": False,
                "has_locations": False,
                "keyword_count": 0,
            },
        }

    @staticmethod
    def _calculate_confidence(
        *,
        is_question: bool,
        language: str,
        question_type: str,
        intent_confidence: float,
        entities: List[Any],
        locations: List[Any],
        keywords: List[str],
    ) -> float:
        score = 0.0

        if is_question:
            score += 0.20

        if language and language != "unknown":
            score += 0.15

        if question_type and question_type != "general":
            score += 0.20

        score += min(
            0.25,
            max(0.0, intent_confidence) * 0.25,
        )

        if entities:
            score += 0.08

        if locations:
            score += 0.05

        if keywords:
            score += 0.07

        return round(
            max(0.0, min(1.0, score)),
            4,
        )

    def is_question(self, question: Any) -> bool:
        text = str(question or "").strip()

        if not text:
            return False

        markers = _detect_question_markers(text)

        return _is_question(
            text,
            markers,
        )

    def detect_language(self, question: Any) -> str:
        result = _safe_call(
            detect_language,
            str(question or ""),
            "unknown",
        )

        if isinstance(result, dict):
            return str(
                result.get("language")
                or result.get("code")
                or "unknown"
            )

        return str(result or "unknown")

    def keywords(self, question: Any) -> List[str]:
        return _extract_keywords(
            str(question or "")
        )

    def question_type(self, question: Any) -> str:
        result = _safe_call(
            detect_question_type,
            str(question or ""),
            "general",
        )

        if isinstance(result, dict):
            return str(
                result.get("type")
                or result.get("question_type")
                or "general"
            )

        return str(result or "general")


# ---------------------------------------------------------------------------
# Functional API
# ---------------------------------------------------------------------------

_parser = QuestionParser()


def parse_question(
    question: Any,
) -> Dict[str, Any]:
    return _parser.parse(question)


def parse(
    question: Any,
) -> Dict[str, Any]:
    return _parser.parse(question)


def analyze_question(
    question: Any,
) -> Dict[str, Any]:
    return _parser.parse(question)


def is_question(
    question: Any,
) -> bool:
    return _parser.is_question(question)


# ---------------------------------------------------------------------------
# Public exports
# ---------------------------------------------------------------------------

__all__ = [
    "ParsedQuestion",
    "QuestionParser",
    "parse_question",
    "parse",
    "analyze_question",
    "is_question",
]

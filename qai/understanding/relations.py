"""
QAI Understanding Layer
relations.py

Final standalone relation extraction layer.

Purpose:
- Detect semantic relations expressed in a user question.
- Extract subject/object candidates.
- Detect common Arabic, French, and English relation patterns.
- Remain independent from RAG, LLM, IntentRouter, and Brain.
- Return deterministic, serializable structures.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Relation definitions
# ---------------------------------------------------------------------------

RELATION_PATTERNS = {
    "capital_of": [
        r"\bعاصمة\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<object>[\u0600-\u06FF\w-]+)\s+عاصمتها\b",
        r"\bcapital\s+of\s+(?P<object>[A-Za-z][\w-]*)",
        r"\bcapitale\s+de\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "located_in": [
        r"أين\s+(?:تقع|يوجد|توجد)\s+(?P<subject>[\u0600-\u06FF\w-]+)",
        r"أين\s+(?:تقع|يوجد|توجد)\s+(?P<subject>[A-Za-z][\w-]*)",

        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+يقع\s+في\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+تقع\s+في\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+موجود(?:ة)?\s+في\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+is\s+in\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+located\s+in\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+est\s+à\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "part_of": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+جزء\s+من\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+تابع(?:ة)?\s+ل(?:ـ)?\s*(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+is\s+part\s+of\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+fait\s+partie\s+de\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "belongs_to": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+ينتمي\s+إلى\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+تابع\s+ل\s*(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+belongs\s+to\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+appartient\s+à\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "created_by": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+(?:أنشأه|أنشأتها|أنشأه)\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+(?:was\s+)?created\s+by\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+a\s+été\s+créé\s+par\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "founded_by": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+(?:أسسها|أسسه|تأسست\s+على\s+يد)\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+was\s+founded\s+by\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+a\s+été\s+fondé(?:e)?\s+par\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "works_for": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+يعمل\s+(?:في|لدى)\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+works\s+for\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+travaille\s+pour\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "has": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+(?:لديه|لديها|يملك|تملك)\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+has\s+(?P<object>[A-Za-z][\w-]*)",
    ],

    "uses": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+(?:يستخدم|تستخدم)\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+uses\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+utilise\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "related_to": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+مرتبط\s+ب(?:ـ)?\s*(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+يتعلق\s+ب(?:ـ)?\s*(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+is\s+related\s+to\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+est\s+lié\s+à\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "depends_on": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+)\s+يعتمد\s+على\s+(?P<object>[\u0600-\u06FF\w-]+)",
        r"\b(?P<subject>[A-Za-z][\w-]*)\s+depends\s+on\s+(?P<object>[A-Za-z][\w-]*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+)\s+dépend\s+de\s+(?P<object>[\wÀ-ÿ-]+)",
    ],

    "comparison": [
        r"(?:ما\s+الفرق\s+بين|ما\s+الفرق\s+بين)\s+(?P<subject>[\u0600-\u06FF\w-]+)\s+و(?P<object>[\u0600-\u06FF\w-]+)",
        r"قارن\s+بين\s+(?P<subject>[\u0600-\u06FF\w-]+)\s+و(?P<object>[\u0600-\u06FF\w-]+)",
        r"compare\s+(?P<subject>[A-Za-z][\w-]*)\s+(?:and|with)\s+(?P<object>[A-Za-z][\w-]*)",
        r"compare\s+(?P<subject>[A-Za-z][\w-]*)\s+(?:et|avec)\s+(?P<object>[\wÀ-ÿ-]+)",
    ],
}

# ---------------------------------------------------------------------------
# Relation aliases
# ---------------------------------------------------------------------------

RELATION_ALIASES = {
    "capital": "capital_of",
    "capital_of": "capital_of",
    "عاصمة": "capital_of",
    "capitale": "capital_of",

    "location": "located_in",
    "located_in": "located_in",
    "في": "located_in",
    "in": "located_in",

    "part": "part_of",
    "part_of": "part_of",
    "جزء": "part_of",

    "belongs": "belongs_to",
    "belongs_to": "belongs_to",
    "ينتمي": "belongs_to",

    "creator": "created_by",
    "created_by": "created_by",
    "أنشأ": "created_by",

    "founder": "founded_by",
    "founded_by": "founded_by",
    "مؤسس": "founded_by",

    "works_for": "works_for",
    "يعمل": "works_for",

    "has": "has",
    "لديه": "has",
    "يملك": "has",

    "uses": "uses",
    "يستخدم": "uses",

    "related": "related_to",
    "related_to": "related_to",
    "مرتبط": "related_to",

    "depends": "depends_on",
    "depends_on": "depends_on",
    "يعتمد": "depends_on",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _clean(value: Any) -> str:
    """Convert a value to a clean string."""
    if value is None:
        return ""

    text = str(value).strip()

    text = re.sub(r"^[\s،,:;.!؟?()\[\]{}]+", "", text)
    text = re.sub(r"[\s،,:;.!؟?()\[\]{}]+$", "", text)

    return text.strip()


def _normalize_relation_name(name: Any) -> str:
    """Normalize a relation name to the canonical relation identifier."""
    value = _clean(name).lower()

    if not value:
        return ""

    return RELATION_ALIASES.get(value, value)


def _make_relation(
    relation: str,
    subject: str = "",
    object_: str = "",
    confidence: float = 0.0,
    pattern: str = "",
) -> Dict[str, Any]:
    """Build a deterministic relation record."""
    return {
        "relation": _normalize_relation_name(relation),
        "subject": _clean(subject),
        "object": _clean(object_),
        "confidence": float(max(0.0, min(1.0, confidence))),
        "pattern": pattern,
    }


# ---------------------------------------------------------------------------
# Relation extraction
# ---------------------------------------------------------------------------

def extract_relations(text: Any) -> List[Dict[str, Any]]:
    """
    Extract semantic relations from text.

    Returns a list of dictionaries:
        {
            "relation": "...",
            "subject": "...",
            "object": "...",
            "confidence": 0.0-1.0,
            "pattern": "..."
        }
    """
    source = _clean(text)

    if not source:
        return []

    results: List[Dict[str, Any]] = []

    for relation_name, patterns in RELATION_PATTERNS.items():
        for pattern in patterns:
            try:
                matches = re.finditer(
                    pattern,
                    source,
                    flags=re.IGNORECASE,
                )
            except re.error:
                continue

            for match in matches:
                groups = match.groupdict()

                subject = _clean(groups.get("subject", ""))
                object_ = _clean(groups.get("object", ""))

                # Capital questions often have only an object.
                if relation_name == "capital_of" and not object_:
                    object_ = subject
                    subject = ""

                if not subject and not object_:
                    continue

                confidence = 0.85

                # More explicit constructions receive a slightly higher score.
                if any(
                    marker in pattern
                    for marker in (
                        "هي",
                        "عاصمتها",
                        "capital\\s+of",
                        "capitale\\s+de",
                    )
                ):
                    confidence = 0.95

                results.append(
                    _make_relation(
                        relation=relation_name,
                        subject=subject,
                        object_=object_,
                        confidence=confidence,
                        pattern=pattern,
                    )
                )

    return _deduplicate_relations(results)


def _deduplicate_relations(
    relations: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Remove duplicate relation records while preserving order."""
    seen = set()
    output = []

    for relation in relations:
        key = (
            relation.get("relation", ""),
            relation.get("subject", ""),
            relation.get("object", ""),
        )

        if key in seen:
            continue

        seen.add(key)
        output.append(relation)

    return output


# ---------------------------------------------------------------------------
# Relation query helpers
# ---------------------------------------------------------------------------

def find_relation(
    text: Any,
    relation: Any,
) -> List[Dict[str, Any]]:
    """Return only relations matching the requested relation type."""
    target = _normalize_relation_name(relation)

    if not target:
        return []

    return [
        item
        for item in extract_relations(text)
        if item.get("relation") == target
    ]


def has_relation(
    text: Any,
    relation: Any,
) -> bool:
    """Return True when the requested relation exists."""
    return bool(find_relation(text, relation))


def first_relation(
    text: Any,
    relation: Optional[Any] = None,
) -> Optional[Dict[str, Any]]:
    """Return the first extracted relation, optionally filtered by type."""
    relations = (
        find_relation(text, relation)
        if relation is not None
        else extract_relations(text)
    )

    return relations[0] if relations else None


# ---------------------------------------------------------------------------
# Subject / object helpers
# ---------------------------------------------------------------------------

def extract_subjects(text: Any) -> List[str]:
    """Extract unique subjects from detected relations."""
    output = []

    for relation in extract_relations(text):
        value = _clean(relation.get("subject"))

        if value and value not in output:
            output.append(value)

    return output


def extract_objects(text: Any) -> List[str]:
    """Extract unique objects from detected relations."""
    output = []

    for relation in extract_relations(text):
        value = _clean(relation.get("object"))

        if value and value not in output:
            output.append(value)

    return output


def relation_signature(relation: Dict[str, Any]) -> str:
    """Return a compact canonical representation of a relation."""
    if not isinstance(relation, dict):
        return ""

    relation_name = _normalize_relation_name(
        relation.get("relation", "")
    )

    subject = _clean(relation.get("subject", ""))
    object_ = _clean(relation.get("object", ""))

    return f"{subject}|{relation_name}|{object_}"


def relation_dict(
    relation: Any,
    subject: Any = "",
    object_: Any = "",
    confidence: float = 1.0,
) -> Dict[str, Any]:
    """
    Public constructor for normalized relation records.

    Useful for other understanding modules that need to create
    a relation without running pattern extraction.
    """
    return _make_relation(
        relation=_normalize_relation_name(relation),
        subject=_clean(subject),
        object_=_clean(object_),
        confidence=confidence,
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

__all__ = [
    "RELATION_PATTERNS",
    "RELATION_ALIASES",
    "extract_relations",
    "find_relation",
    "has_relation",
    "first_relation",
    "extract_subjects",
    "extract_objects",
    "relation_signature",
    "relation_dict",
]

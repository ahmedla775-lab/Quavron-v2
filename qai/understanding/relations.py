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
        # Arabic
        r"(?:ما\s+(?:هي\s+)?عاصمة\s+)(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)(?=\s*[؟?!,،;؛.]|$)",
        r"\bعاصمة\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)(?=\s*[؟?!,،;؛.]|$)",
        r"\b(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)\s+عاصمتها\b",

        # English
        r"\bcapital\s+of\s+(?P<object>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*?)(?=\s*[?!,.;]|$)",

        # French
        r"\bcapitale\s+de\s+(?P<object>[\wÀ-ÿ-]+(?:\s+[\wÀ-ÿ-]+)*?)(?=\s*[?!,.;]|$)",
    ],

    "located_in": [
        r"(?:أين|اين)\s+(?:يقع|تقع|موجود|موجودة)\s+(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"أين\s+(?:تقع|يوجد|توجد)\s+(?P<subject>[\u0600-\u06FF\w-]+)",
        r"أين\s+(?:تقع|يوجد|توجد)\s+(?P<subject>[A-Za-z][\w-]*)",

        r"\b(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)\s+يقع\s+في\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)\s+تقع\s+في\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"\b(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)\s+موجود(?:ة)?\s+في\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
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

    "lives_in": [
        r"(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)\s+(?:يعيش|تعيش|يسكن|تسكن)\s+(?:في|بـ|ب)\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)(?=\s*[؟?!,،;؛.]|$)",
        r"(?:هل\s+)?(?:يعيش|تعيش|يسكن|تسكن)\s+(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)\s+(?:في|بـ|ب)\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)(?=\s*[؟?!,،;؛.]|$)",
        r"\b(?P<subject>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)\s+(?:lives|resides)\s+in\s+(?P<object>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)",
        r"\b(?P<subject>[\wÀ-ÿ-]+(?:\s+[\wÀ-ÿ-]+)*)\s+(?:vit|habite)\s+à\s+(?P<object>[\wÀ-ÿ-]+(?:\s+[\wÀ-ÿ-]+)*)",
    ],

    "works_for": [
        r"\b(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)\s+يعمل\s+(?:في|لدى)\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
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

    "population_of": [
        r"(?:ما\s+(?:هو\s+)?عدد\s+سكان\s+)(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"عدد\s+سكان\s+(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"population\s+of\s+(?P<object>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)",
    ],
    "built_by": [
        r"من\s+(?:بنى|قام\s+ببناء)\s+(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        # من بنى برج إيفل؟ -> subject=برج إيفل
        r"من\s+بنى\s+(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        # English: Eiffel Tower was built by Gustave Eiffel
        r"(?P<subject>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)\s+was\s+built\s+by\s+(?P<object>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)",
    ],
    "famous_for": [
        r"(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)\s+مشهور(?:ة)?\s+ب(?:ـ)?\s*(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*)",
        r"(?P<subject>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)\s+is\s+famous\s+for\s+(?P<object>[A-Za-z][\w-]*(?:\s+[A-Za-z][\w-]*)*)",
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

    "population": "population_of",
    "population_of": "population_of",
    "سكان": "population_of",

    "built_by": "built_by",
    "built": "built_by",
    "بنى": "built_by",

    "famous_for": "famous_for",
    "famous": "famous_for",
    "مشهور": "famous_for",
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

    # --------------------------------------------------------------
    # Compound-question context
    #
    # Example:
    #   من هو يوسف السعدي؟ وأين يعيش؟ هل يعيش في مصر؟
    #
    # The final "هل يعيش في مصر" clause must inherit the person
    # introduced by the previous identity clause.
    # --------------------------------------------------------------
    context_subject = ""

    identity_matches = re.findall(
        r"(?:من|ما)\\s+(?:هو|هي)\\s+"
        r"(?P<subject>[\\u0600-\\u06FF\\w-]+"
        r"(?:\\s+[\\u0600-\\u06FF\\w-]+)*?)"
        r"(?=\\s*[؟?!,،;؛.]|$)",
        source,
        flags=re.IGNORECASE,
    )

    if identity_matches:
        context_subject = _clean(identity_matches[-1])

    # Direct compound lives_in question.
    # This is intentionally handled before the generic relation
    # patterns because those patterns can otherwise consume the
    # entire text before "يعيش".
    compound_lives = re.search(
        r"(?:هل\\s+)?(?:يعيش|تعيش|يسكن|تسكن)\\s+"
        r"(?P<subject>[\\u0600-\\u06FF\\w-]+"
        r"(?:\\s+[\\u0600-\\u06FF\\w-]+)*?)\\s+"
        r"(?:في|بـ|ب)\\s+"
        r"(?P<object>[\\u0600-\\u06FF\\w-]+"
        r"(?:\\s+[\\u0600-\\u06FF\\w-]+)*?)"
        r"(?=\\s*[؟?!,،;؛.]|$)",
        source,
        flags=re.IGNORECASE,
    )

    if compound_lives:
        compound_subject = _clean(
            compound_lives.group("subject")
        )

        # If the regex consumed previous question text, use the
        # identity subject instead.
        if context_subject and (
            "؟" in compound_subject
            or "?" in compound_subject
            or "!" in compound_subject
            or "هل" in compound_subject
            or compound_subject.startswith("من ")
            or compound_subject.startswith("ما ")
        ):
            compound_subject = context_subject

        results.append(
            _make_relation(
                relation="lives_in",
                subject=compound_subject,
                object_=compound_lives.group("object"),
                confidence=0.90,
                pattern=compound_lives.re.pattern,
            )
        )

        # Mark this relation as already handled so the generic
        # lives_in regex cannot create the erroneous duplicate.
        handled_compound_lives = True
    else:
        handled_compound_lives = False

    # In compound Arabic questions, prefer the final direct
    # yes/no clause, e.g.:
    #   من هو يوسف السعدي؟ وأين يعيش؟ هل يعيش في مصر؟
    # The semantic subject is the person named in the preceding
    # identity clause, not the whole preceding question.
    compound_lives = re.search(
        r"(?:هل\s+)?(?:يعيش|تعيش|يسكن|تسكن)\s+"
        r"(?P<subject>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)\s+"
        r"(?:في|بـ|ب)\s+"
        r"(?P<object>[\u0600-\u06FF\w-]+(?:\s+[\u0600-\u06FF\w-]+)*?)"
        r"(?=\s*[؟?!,،;؛.]|$)",
        source,
        flags=re.IGNORECASE,
    )

    if compound_lives:
        groups = compound_lives.groupdict()

        results.append(
            _make_relation(
                relation="lives_in",
                subject=groups.get("subject", ""),
                object_=groups.get("object", ""),
                confidence=0.90,
                pattern=compound_lives.re.pattern,
            )
        )

    for relation_name, patterns in RELATION_PATTERNS.items():
        for pattern in patterns:

            # The compound lives_in question was already extracted
            # above using clause-aware context.
            if relation_name == "lives_in" and handled_compound_lives:
                continue

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


# QAI_CLAUSE_AWARE_RELATIONS_PATCH_V1
# Context-aware wrapper for compound questions/statements.
# Keeps the existing relation detectors intact.

_original_extract_relations = extract_relations


def _qai_clean_context_subject(value):
    import re

    value = str(value or "").strip()

    # Remove common Arabic question prefixes.
    value = re.sub(
        r"^(?:من|ما)\s+(?:هو|هي)\s+",
        "",
        value,
        flags=re.IGNORECASE,
    )

    value = re.sub(
        r"^(?:من|ما)\s+",
        "",
        value,
        flags=re.IGNORECASE,
    )

    # Stop at the first question/statement boundary.
    value = re.split(r"[؟?!,،;؛.]", value, maxsplit=1)[0]

    return value.strip(" \t\r\n")


def _qai_context_subject(text):
    import re

    # Explicit identity/question context:
    # "من هو يوسف السعدي؟"
    patterns = (
        r"(?:^|[؟?!,،;؛.]\s*)من\s+هو\s+(?P<subject>[^؟?!,،;؛.]+)",
        r"(?:^|[؟?!,،;؛.]\s*)من\s+هي\s+(?P<subject>[^؟?!,،;؛.]+)",
    )

    for pattern in patterns:
        m = re.search(pattern, text, flags=re.IGNORECASE)
        if m:
            subject = _qai_clean_context_subject(m.group("subject"))
            if subject:
                return subject

    return None


def extract_relations(text):
    import re

    text = str(text or "").strip()

    # Normal/simple case: keep the existing implementation exactly as-is.
    if not re.search(r"[؟?!,،;؛.]", text):
        return _original_extract_relations(text)

    # First run the original detector on the complete text.
    relations = _original_extract_relations(text)

    # For compound questions, also inspect each clause independently.
    clauses = [
        c.strip()
        for c in re.split(r"[؟?!,،;؛.]+", text)
        if c.strip()
    ]

    for clause in clauses:
        if clause == text:
            continue

        for relation in _original_extract_relations(clause):
            duplicate = any(
                r.get("relation") == relation.get("relation")
                and r.get("subject") == relation.get("subject")
                and r.get("object") == relation.get("object")
                for r in relations
            )

            if not duplicate:
                relations.append(relation)

    # Recover the subject from an earlier identity clause.
    context_subject = _qai_context_subject(text)

    if context_subject:
        for relation in relations:
            if relation.get("relation") == "lives_in":
                subject = str(relation.get("subject") or "").strip()

                # Replace polluted subject such as:
                # "من هو يوسف السعدي؟ وأين يعيش؟ هل"
                if (
                    not subject
                    or "من هو" in subject
                    or "من هي" in subject
                    or "هل" in subject
                    or "أين" in subject
                    or "؟" in subject
                    or "?" in subject
                ):
                    relation["subject"] = context_subject
                    relation["confidence"] = max(
                        float(relation.get("confidence", 0.85)),
                        0.90,
                    )

    # Final deduplication.
    unique = []
    seen = set()

    for relation in relations:
        key = (
            relation.get("relation"),
            relation.get("subject"),
            relation.get("object"),
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(relation)

    return unique

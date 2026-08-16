"""
QAI Understanding Layer
question_types.py

Final standalone question-type detection layer.

Purpose:
- Classify the structural type of a user question.
- Support Arabic, English, and French.
- Detect factual, definition, explanation, comparison,
  procedural, causal, temporal, location, counting, yes/no,
  identity, and other common question forms.
- Remain independent from IntentRouter, RAG, Brain, and LLM.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List


# ---------------------------------------------------------------------------
# Question type definitions
# ---------------------------------------------------------------------------

QUESTION_TYPES = (
    "definition",
    "explanation",
    "factual",
    "comparison",
    "procedure",
    "cause",
    "effect",
    "temporal",
    "location",
    "count",
    "identity",
    "yes_no",
    "list",
    "example",
    "opinion",
    "recommendation",
    "translation",
    "calculation",
    "general_question",
    "statement",
)


# ---------------------------------------------------------------------------
# Marker dictionaries
# ---------------------------------------------------------------------------

TYPE_MARKERS = {
    "definition": (
        "ما هو",
        "ما هي",
        "ما معنى",
        "ماذا يعني",
        "ماذا تعني",
        "ما المقصود",
        "عرّف",
        "عرف",
        "تعريف",
        "ما مفهوم",
        "what is",
        "what are",
        "what does",
        "define",
        "definition",
        "meaning of",
        "qu'est-ce que",
        "qu'est ce que",
        "définition",
        "signification",
    ),
    "explanation": (
        "اشرح",
        "شرح",
        "فسر",
        "فسّر",
        "وضح",
        "وضّح",
        "كيف يعمل",
        "كيف تعمل",
        "لماذا يعمل",
        "why does",
        "why do",
        "explain",
        "explanation",
        "how does it work",
        "comment fonctionne",
        "explique",
        "explication",
    ),
    "comparison": (
        "ما الفرق",
        "الفرق بين",
        "قارن",
        "مقارنة",
        "أيهما أفضل",
        "ايهما افضل",
        "أيهما",
        "ايهما",
        "أيهم أفضل",
        "من الأفضل",
        "أفضل من",
        "مقابل",
        "versus",
        "vs",
        "difference between",
        "compare",
        "comparison",
        "which is better",
        "différence entre",
        "comparer",
        "meilleur que",
    ),
    "procedure": (
        "كيف",
        "كيفية",
        "طريقة",
        "خطوات",
        "خطوة",
        "كيف يمكن",
        "كيف أستطيع",
        "كيف استطيع",
        "ماذا أفعل",
        "ماذا افعل",
        "how to",
        "how can",
        "steps",
        "step by step",
        "procedure",
        "method",
        "comment faire",
        "étapes",
        "méthode",
    ),
    "cause": (
        "لماذا",
        "لِماذا",
        "ما سبب",
        "سبب",
        "بسبب ماذا",
        "لماذا حدث",
        "why",
        "reason",
        "cause",
        "what caused",
        "pourquoi",
        "raison",
        "cause de",
    ),
    "effect": (
        "ما تأثير",
        "ما أثر",
        "ماذا يحدث إذا",
        "ماذا سيحدث",
        "نتيجة",
        "تأثير",
        "أثر",
        "what happens if",
        "effect of",
        "impact of",
        "result of",
        "quels sont les effets",
        "impact",
    ),
    "temporal": (
        "متى",
        "متى حدث",
        "متى بدأ",
        "متى تأسس",
        "متى تأسست",
        "متى تم",
        "متى سيكون",
        "متى يحدث",
        "أي عام",
        "في أي سنة",
        "منذ متى",
        "كم مضى",
        "when",
        "what year",
        "since when",
        "how long ago",
        "quand",
        "quelle année",
        "depuis quand",
    ),
    "location": (
        "أين",
        "أين يوجد",
        "أين توجد",
        "أين يقع",
        "أين تقع",
        "مكان",
        "موقع",
        "في أي بلد",
        "في أي مدينة",
        "where",
        "where is",
        "location",
        "located",
        "où",
        "où se trouve",
        "emplacement",
    ),
    "count": (
        "كم",
        "كم عدد",
        "كم شخص",
        "كم مستخدم",
        "كم مرة",
        "كم وحدة",
        "عدد",
        "how many",
        "how much",
        "number of",
        "combien",
        "combien de",
        "nombre de",
    ),
    "identity": (
        "من هو",
        "من هي",
        "من يكون",
        "من تكون",
        "من هم",
        "من هم مؤسسو",
        "من أسس",
        "من أسسها",
        "من أنشأ",
        "من أنشأها",
        "who is",
        "who are",
        "who founded",
        "who created",
        "qui est",
        "qui sont",
        "qui a fondé",
    ),
    "yes_no": (
        "هل",
        "أ",
        "أيمكن",
        "هل يمكن",
        "هل يستطيع",
        "هل تستطيع",
        "هل يوجد",
        "هل توجد",
        "هل صحيح",
        "أليس",
        "أليس كذلك",
        "is it",
        "are there",
        "can",
        "does",
        "do",
        "is",
        "are",
        "est-ce que",
        "peut-on",
    ),
    "list": (
        "اذكر",
        "أذكر",
        "اذكر لي",
        "أعطني قائمة",
        "اعطني قائمة",
        "ما هي الأنواع",
        "ما أنواع",
        "ما هي أمثلة",
        "أمثلة على",
        "list",
        "list of",
        "give me a list",
        "types of",
        "examples of",
        "liste",
        "types de",
        "exemples de",
    ),
    "example": (
        "مثال",
        "مثالا",
        "مثال على",
        "أعطني مثال",
        "اعطني مثال",
        "أمثلة",
        "example",
        "give me an example",
        "examples",
        "exemple",
        "donne-moi un exemple",
    ),
    "opinion": (
        "ما رأيك",
        "برأيك",
        "هل تعتقد",
        "هل ترى",
        "رأيك في",
        "ما تقييمك",
        "what do you think",
        "in your opinion",
        "do you think",
        "opinion",
        "qu'en penses-tu",
        "à ton avis",
    ),
    "recommendation": (
        "بماذا تنصحني",
        "ماذا تنصح",
        "ما الذي تنصح",
        "ما أفضل",
        "ما هو الأفضل",
        "اقترح",
        "اقتراح",
        "recommend",
        "recommendation",
        "what do you recommend",
        "best option",
        "que recommandes-tu",
        "recommandation",
    ),
    "translation": (
        "ترجم",
        "ترجمة",
        "ترجم إلى",
        "ترجم من",
        "كيف نقول",
        "كيف أقول",
        "معنى كلمة",
        "translate",
        "translation",
        "translate to",
        "translate from",
        "how do you say",
        "traduire",
        "traduction",
        "comment dire",
    ),
    "calculation": (
        "احسب",
        "حساب",
        "كم يساوي",
        "ما ناتج",
        "اجمع",
        "اطرح",
        "اضرب",
        "اقسم",
        "calculate",
        "calculation",
        "how much is",
        "sum",
        "subtract",
        "multiply",
        "divide",
        "calculer",
        "combien font",
    ),
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _clean_text(value: Any) -> str:
    """Convert input to normalized searchable text."""
    if value is None:
        return ""

    text = str(value).strip().lower()

    text = re.sub(r"\s+", " ", text)

    return text


def _contains_marker(text: str, marker: str) -> bool:
    """Safely detect a marker inside text."""
    marker = marker.strip().lower()

    if not marker:
        return False

    return marker in text


def _marker_hits(text: str, question_type: str) -> List[str]:
    """Return markers found for a given question type."""
    markers = TYPE_MARKERS.get(question_type, ())

    return [
        marker
        for marker in markers
        if _contains_marker(text, marker)
    ]


def _has_question_form(text: str) -> bool:
    """Detect common explicit question syntax."""
    if not text:
        return False

    if "؟" in text or "?" in text:
        return True

    question_words = (
        "ما ",
        "ماذا ",
        "من ",
        "متى ",
        "أين ",
        "كيف ",
        "لماذا ",
        "هل ",
        "كم ",
        "أي ",
        "ما هو",
        "ما هي",
        "who ",
        "what ",
        "when ",
        "where ",
        "why ",
        "how ",
        "which ",
        "can ",
        "is ",
        "are ",
        "do ",
        "does ",
        "quand ",
        "où ",
        "pourquoi ",
        "comment ",
        "qui ",
        "est-ce",
    )

    return any(word in text for word in question_words)


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def detect_question_type(text: Any) -> Dict[str, Any]:
    """
    Classify a question.

    Returns:
        {
            "type": "...",
            "confidence": float,
            "is_question": bool,
            "markers": [...],
            "candidates": [...]
        }
    """
    source = _clean_text(text)

    if not source:
        return {
            "type": "statement",
            "confidence": 0.0,
            "is_question": False,
            "markers": [],
            "candidates": [],
        }

    is_question = _has_question_form(source)

    candidates: List[Dict[str, Any]] = []

    # Explicit translation/calculation should win over generic patterns.
    priority = [
        "translation",
        "calculation",
        "comparison",
        "definition",
        "identity",
        "location",
        "temporal",
        "count",
        "cause",
        "effect",
        "procedure",
        "explanation",
        "yes_no",
        "list",
        "example",
        "recommendation",
        "opinion",
        "factual",
    ]

    for question_type in priority:
        hits = _marker_hits(source, question_type)

        if not hits:
            continue

        # Base score.
        score = 0.70

        # Explicit punctuation strengthens question classification.
        if is_question:
            score += 0.10

        # Multiple markers increase confidence slightly.
        if len(hits) >= 2:
            score += 0.05

        # Very explicit long markers are more reliable.
        if any(len(marker) >= 10 for marker in hits):
            score += 0.05

        candidates.append(
            {
                "type": question_type,
                "confidence": min(score, 0.99),
                "markers": hits,
            }
        )

    # Special factual patterns.
    if not candidates:
        factual_patterns = (
            r"^ما\s+",
            r"^ماذا\s+",
            r"^من\s+",
            r"^متى\s+",
            r"^أين\s+",
            r"^كيف\s+",
            r"^هل\s+",
            r"^كم\s+",
            r"^who\s+",
            r"^what\s+",
            r"^when\s+",
            r"^where\s+",
            r"^how\s+",
            r"^which\s+",
            r"^qui\s+",
            r"^où\s+",
            r"^quand\s+",
            r"^comment\s+",
        )

        if any(re.search(pattern, source) for pattern in factual_patterns):
            candidates.append(
                {
                    "type": "factual",
                    "confidence": 0.70,
                    "markers": [],
                }
            )

    if not candidates:
        if is_question:
            return {
                "type": "general_question",
                "confidence": 0.55,
                "is_question": True,
                "markers": [],
                "candidates": [],
            }

        return {
            "type": "statement",
            "confidence": 0.80,
            "is_question": False,
            "markers": [],
            "candidates": [],
        }

    best = candidates[0]

    return {
        "type": best["type"],
        "confidence": best["confidence"],
        "is_question": is_question,
        "markers": best["markers"],
        "candidates": candidates,
    }


# ---------------------------------------------------------------------------
# Convenience functions
# ---------------------------------------------------------------------------

def classify(text: Any) -> str:
    """Return only the detected question type."""
    return detect_question_type(text)["type"]


def question_type(text: Any) -> str:
    """Alias for classify()."""
    return classify(text)


def is_question(text: Any) -> bool:
    """Return True when input appears to be a question."""
    return bool(detect_question_type(text)["is_question"])


def is_type(text: Any, expected_type: str) -> bool:
    """Check whether the detected type matches expected_type."""
    expected = _clean_text(expected_type)

    return classify(text) == expected


def all_types() -> List[str]:
    """Return all supported question types."""
    return list(QUESTION_TYPES)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

__all__ = [
    "QUESTION_TYPES",
    "TYPE_MARKERS",
    "detect_question_type",
    "classify",
    "question_type",
    "is_question",
    "is_type",
    "all_types",
]

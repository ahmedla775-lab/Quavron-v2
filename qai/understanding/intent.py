"""
QAI Understanding Layer
intent.py

Final standalone semantic-intent detection layer.

Purpose:
- Detect the semantic intent of a user message.
- Work independently from intent/router.py.
- Support Arabic, English, and French.
- Provide deterministic intent classification.
- Preserve enough detail for later integration with Brain/RAG/LLM.
- Do NOT replace the existing IntentRouter.

This module answers:
    "What does the user want to do?"

It does not answer:
    "What should the system do with the request?"
That responsibility remains with the existing intent/router.py.
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Tuple


# ---------------------------------------------------------------------------
# Canonical intents
# ---------------------------------------------------------------------------

INTENTS = (
    "information",
    "definition",
    "explanation",
    "procedure",
    "comparison",
    "cause",
    "effect",
    "location",
    "temporal",
    "count",
    "identity",
    "verification",
    "translation",
    "calculation",
    "learning",
    "programming",
    "creation",
    "analysis",
    "research",
    "recommendation",
    "opinion",
    "troubleshooting",
    "general",
)


# ---------------------------------------------------------------------------
# Intent markers
# ---------------------------------------------------------------------------

INTENT_MARKERS = {
    "definition": (
        "ما هو",
        "ما هي",
        "ما معنى",
        "ماذا يعني",
        "ماذا تعني",
        "ما المقصود",
        "تعريف",
        "عرّف",
        "عرف",
        "what is",
        "what are",
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
        "explain",
        "explanation",
        "how does it work",
        "why does it work",
        "explique",
        "explication",
        "comment fonctionne",
    ),

    "procedure": (
        "كيف",
        "كيفية",
        "طريقة",
        "خطوات",
        "خطوة بخطوة",
        "كيف يمكن",
        "كيف أستطيع",
        "ماذا أفعل",
        "كيف أقوم",
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

    "comparison": (
        "ما الفرق",
        "الفرق بين",
        "قارن",
        "مقارنة",
        "أيهما أفضل",
        "ايهما افضل",
        "من الأفضل",
        "أفضل من",
        "مقابل",
        "vs",
        "versus",
        "difference between",
        "compare",
        "comparison",
        "which is better",
        "différence entre",
        "comparer",
        "meilleur que",
    ),

    "cause": (
        "لماذا",
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
        "effet de",
        "impact",
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

    "temporal": (
        "متى",
        "متى حدث",
        "متى بدأ",
        "متى تأسس",
        "متى تأسست",
        "متى تم",
        "متى سيكون",
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

    "verification": (
        "هل صحيح",
        "هل هذا صحيح",
        "تحقق",
        "تحقق من",
        "تأكد",
        "تأكد من",
        "هل يمكن التحقق",
        "verify",
        "verification",
        "check if",
        "is this correct",
        "confirm",
        "vérifier",
        "vérification",
        "confirmer",
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

    "learning": (
        "تعلم",
        "التعلم",
        "دورة",
        "درس",
        "دروس",
        "تعليمي",
        "علمني",
        "علّم",
        "تعلمني",
        "learn",
        "learning",
        "course",
        "lesson",
        "teach me",
        "training",
        "apprendre",
        "apprentissage",
        "cours",
        "leçon",
    ),

    "programming": (
        "برمجة",
        "برمج",
        "كود",
        "كود برمجي",
        "شفرة",
        "تطوير",
        "مطور",
        "بايثون",
        "جافاسكريبت",
        "python",
        "javascript",
        "typescript",
        "react",
        "code",
        "coding",
        "programming",
        "developer",
        "development",
        "programmation",
        "développement",
    ),

    "creation": (
        "أنشئ",
        "انشئ",
        "أنشأ",
        "اصنع",
        "صمم",
        "صمّم",
        "اكتب لي",
        "اكتب",
        "بناء",
        "ابن",
        "إنشاء",
        "create",
        "build",
        "make",
        "design",
        "write",
        "generate",
        "créér",
        "créer",
        "construire",
        "concevoir",
    ),

    "analysis": (
        "حلل",
        "حلّل",
        "تحليل",
        "فسر البيانات",
        "استخرج النتائج",
        "ما الذي نستنتج",
        "analyze",
        "analysis",
        "analyse",
        "interpréter",
        "interpret",
        "find the results",
    ),

    "research": (
        "ابحث",
        "بحث",
        "ابحث عن",
        "قم بالبحث",
        "مصادر",
        "مرجع",
        "مراجع",
        "دراسة",
        "research",
        "search",
        "find sources",
        "sources",
        "references",
        "study",
        "recherche",
        "sources",
        "références",
        "étude",
    ),

    "recommendation": (
        "بماذا تنصحني",
        "ماذا تنصح",
        "ما الذي تنصح",
        "ما أفضل",
        "ما هو الأفضل",
        "اقترح",
        "اقتراح",
        "أنصح",
        "recommend",
        "recommendation",
        "what do you recommend",
        "best option",
        "suggest",
        "suggestion",
        "que recommandes-tu",
        "recommandation",
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

    "troubleshooting": (
        "لماذا لا يعمل",
        "لا يعمل",
        "لا تعمل",
        "يوجد خطأ",
        "ظهر خطأ",
        "خطأ",
        "مشكلة",
        "المشكلة",
        "فشل",
        "لا يستجيب",
        "لا يظهر",
        "لماذا لا",
        "error",
        "bug",
        "problem",
        "issue",
        "not working",
        "doesn't work",
        "failed",
        "failure",
        "debug",
        "debugging",
        "erreur",
        "problème",
        "ne fonctionne pas",
        "échec",
    ),
}


# ---------------------------------------------------------------------------
# Priority
# ---------------------------------------------------------------------------

# When several intents are detected, earlier entries have precedence.
INTENT_PRIORITY = (
    "troubleshooting",
    "verification",
    "translation",
    "calculation",
    "comparison",
    "definition",
    "identity",
    "location",
    "temporal",
    "count",
    "research",
    "programming",
    "learning",
    "creation",
    "analysis",
    "recommendation",
    "opinion",
    "cause",
    "effect",
    "procedure",
    "explanation",
    "information",
    "general",
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _clean_text(value: Any) -> str:
    """Normalize input for intent matching."""
    if value is None:
        return ""

    text = str(value).strip().lower()

    text = re.sub(r"\s+", " ", text)

    return text


def _contains(text: str, marker: str) -> bool:
    """Return True when marker exists in text."""
    marker = marker.strip().lower()

    if not marker:
        return False

    return marker in text


def _hits(text: str, intent: str) -> List[str]:
    """Return all markers detected for an intent."""
    return [
        marker
        for marker in INTENT_MARKERS.get(intent, ())
        if _contains(text, marker)
    ]


def _question_signal(text: str) -> bool:
    """Detect explicit or lexical question signals."""
    if not text:
        return False

    if "؟" in text or "?" in text:
        return True

    markers = (
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
        "qui ",
        "où ",
        "quand ",
        "comment ",
        "pourquoi ",
    )

    return any(marker in text for marker in markers)


def _score_intent(
    text: str,
    intent: str,
    hits: List[str],
) -> float:
    """Calculate deterministic confidence for an intent."""
    if not hits:
        return 0.0

    score = 0.55

    if len(hits) >= 2:
        score += 0.08

    if any(len(marker) >= 10 for marker in hits):
        score += 0.08

    if _question_signal(text):
        score += 0.04

    # Strong lexical evidence.
    strong_markers = {
        "troubleshooting": (
            "لا يعمل",
            "مشكلة",
            "خطأ",
            "error",
            "bug",
            "not working",
        ),
        "verification": (
            "تحقق",
            "تأكد",
            "هل صحيح",
            "verify",
            "confirm",
        ),
        "translation": (
            "ترجم",
            "ترجمة",
            "translate",
            "translation",
            "traduire",
        ),
        "calculation": (
            "احسب",
            "كم يساوي",
            "calculate",
        ),
        "comparison": (
            "ما الفرق",
            "الفرق بين",
            "قارن",
            "difference between",
            "compare",
        ),
    }

    if any(marker in text for marker in strong_markers.get(intent, ())):
        score += 0.15

    return min(score, 0.99)


# ---------------------------------------------------------------------------
# Main detector
# ---------------------------------------------------------------------------

def detect_intent(text: Any) -> Dict[str, Any]:
    """
    Detect semantic intent.

    Returns:
        {
            "intent": "...",
            "confidence": 0.0-0.99,
            "markers": [...],
            "candidates": [...],
            "is_question": bool,
            "input": "..."
        }
    """
    source = _clean_text(text)

    if not source:
        return {
            "intent": "general",
            "confidence": 0.0,
            "markers": [],
            "candidates": [],
            "is_question": False,
            "input": "",
        }

    candidates: List[Dict[str, Any]] = []

    for intent in INTENT_PRIORITY:
        hits = _hits(source, intent)

        if not hits:
            continue

        confidence = _score_intent(
            source,
            intent,
            hits,
        )

        candidates.append(
            {
                "intent": intent,
                "confidence": confidence,
                "markers": hits,
            }
        )

    # Sort primarily by confidence and secondarily by declared priority.
    priority_index = {
        name: index
        for index, name in enumerate(INTENT_PRIORITY)
    }

    candidates.sort(
        key=lambda item: (
            -float(item["confidence"]),
            priority_index.get(item["intent"], 999),
        )
    )

    if not candidates:
        return {
            "intent": "general",
            "confidence": 0.35,
            "markers": [],
            "candidates": [],
            "is_question": _question_signal(source),
            "input": source,
        }

    best = candidates[0]

    return {
        "intent": best["intent"],
        "confidence": best["confidence"],
        "markers": best["markers"],
        "candidates": candidates,
        "is_question": _question_signal(source),
        "input": source,
    }


# ---------------------------------------------------------------------------
# Convenience API
# ---------------------------------------------------------------------------

def classify(text: Any) -> str:
    """Return only the canonical intent name."""
    return detect_intent(text)["intent"]


def intent(text: Any) -> str:
    """Alias for classify()."""
    return classify(text)


def confidence(text: Any) -> float:
    """Return detected intent confidence."""
    return float(
        detect_intent(text).get("confidence", 0.0)
    )


def is_intent(
    text: Any,
    expected: str,
) -> bool:
    """Check whether input belongs to the expected intent."""
    return classify(text) == _clean_text(expected)


def all_intents() -> List[str]:
    """Return all supported canonical intents."""
    return list(INTENTS)


def detect(
    text: Any,
) -> Dict[str, Any]:
    """Compatibility alias for detect_intent()."""
    return detect_intent(text)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

__all__ = [
    "INTENTS",
    "INTENT_MARKERS",
    "INTENT_PRIORITY",
    "detect_intent",
    "detect",
    "classify",
    "intent",
    "confidence",
    "is_intent",
    "all_intents",
]

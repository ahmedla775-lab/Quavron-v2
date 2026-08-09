from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class IntentResult:
    intent: str
    confidence: float
    metadata: Dict[str, Any]


class IntentEngine:
    """
    Lightweight local intent detection engine.

    No external APIs or AI models are required.
    """

    _RULES = {
        "greeting": (
            "مرحبا",
            "مرحبًا",
            "اهلا",
            "أهلا",
            "السلام عليكم",
            "hello",
            "hi",
            "hey",
        ),
        "knowledge": (
            "ما هو",
            "ماهي",
            "ما هي",
            "من هو",
            "من هي",
            "ما معنى",
            "what is",
            "who is",
            "quavron",
            "qai",
            "cloud ide",
            "community",
            "courses",
            "hosting",
            "marketplace",
            "social hub",
        ),
        "help": (
            "ساعدني",
            "مساعدة",
            "كيف يمكن",
            "كيف أ",
            "كيف ا",
            "help",
            "how can",
            "how do",
        ),
        "learn": (
            "تعلم",
            "احفظ",
            "سجل",
            "أضف معلومة",
            "learn",
            "remember",
            "save this",
        ),
        "reasoning": (
            "لماذا",
            "كيف ذلك",
            "استنتج",
            "حلل",
            "قارن",
            "why",
            "analyze",
            "compare",
            "reason",
        ),
    }

    # Higher priority wins when multiple intents match.
    _PRIORITY = (
        "greeting",
        "reasoning",
        "learn",
        "help",
        "knowledge",
    )

    def detect(self, text: str) -> IntentResult:
        text = str(text or "").strip().lower()

        if not text:
            return IntentResult(
                intent="unknown",
                confidence=0.0,
                metadata={"reason": "empty_input"},
            )

        scores: Dict[str, int] = {}

        for intent, keywords in self._RULES.items():
            score = sum(
                1
                for keyword in keywords
                if keyword in text
            )

            if score:
                scores[intent] = score

        if not scores:
            return IntentResult(
                intent="unknown",
                confidence=0.2,
                metadata={"matched": []},
            )

        ranked = [
            (intent, scores[intent])
            for intent in self._PRIORITY
            if intent in scores
        ]

        if ranked:
            best_score = max(
                score
                for _, score in ranked
            )

            best = [
                (intent, score)
                for intent, score in ranked
                if score == best_score
            ]

            intent, score = best[0]

        else:
            intent, score = max(
                scores.items(),
                key=lambda item: item[1],
            )

        confidence = min(
            1.0,
            0.5 + (score * 0.2),
        )

        return IntentResult(
            intent=intent,
            confidence=confidence,
            metadata={
                "matched": [
                    keyword
                    for keyword in self._RULES[intent]
                    if keyword in text
                ],
            },
        )

"""
QAI Decision / Task Router

Consumes the Understanding Contract only.

This layer does NOT:
- parse the raw question
- import Understanding
- call the LLM Router
- select an LLM provider
- access RAG / Research / Memory

Its responsibility is to convert semantic Understanding
into task-level execution decisions.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, Set


class DecisionRouter:
    """Convert Understanding Contract into execution decisions."""

    COMPARISON_TERMS: Set[str] = {
        "comparison",
        "compare",
        "comparative",
        "difference",
        "differences",
        "versus",
        "vs",
        "مقارنة",
        "قارن",
        "الفرق",
        "اختلاف",
        "مقابل",
        "مقابلتهما",
        "مقارن",
        "comparaison",
        "comparer",
        "différence",
        "differences",
    }

    PROGRAMMING_TERMS: Set[str] = {
        "code",
        "coding",
        "program",
        "programming",
        "developer",
        "development",
        "python",
        "javascript",
        "typescript",
        "java",
        "c",
        "cpp",
        "html",
        "css",
        "sql",
        "api",
        "function",
        "class",
        "bug",
        "debug",
        "error",
        "exception",
        "script",
        "terminal",
        "command",
        "code",
        "برمجة",
        "برمجي",
        "برمجية",
        "كود",
        "شفرة",
        "مطور",
        "تطوير",
        "دالة",
        "خطأ",
        "تصحيح",
        "سكريبت",
        "أمر",
        "فرنسية",
        "programmation",
        "code",
        "développement",
        "fonction",
        "erreur",
    }

    REASONING_TERMS: Set[str] = {
        "reasoning",
        "reason",
        "logic",
        "logical",
        "analysis",
        "analyze",
        "analyse",
        "why",
        "explain",
        "derive",
        "proof",
        "solve",
        "problem",
        "استدلال",
        "استنتاج",
        "منطق",
        "تحليل",
        "حلل",
        "حل",
        "برهان",
        "إثبات",
        "فسر",
        "اشرح",
        "لماذا",
        "raisonnement",
        "logique",
        "analyse",
        "expliquer",
        "preuve",
        "résoudre",
    }

    VISION_TERMS: Set[str] = {
        "image",
        "images",
        "photo",
        "picture",
        "vision",
        "visual",
        "screenshot",
        "diagram",
        "image",
        "صور",
        "صورة",
        "صورتي",
        "لقطة",
        "مخطط",
        "بصري",
        "رؤية",
        "visuel",
        "photo",
        "image",
        "capture",
        "schéma",
    }

    RESEARCH_TERMS: Set[str] = {
        "research",
        "search",
        "latest",
        "recent",
        "news",
        "source",
        "sources",
        "web",
        "internet",
        "بحث",
        "ابحث",
        "بحثًا",
        "مصادر",
        "مصدر",
        "أخبار",
        "آخر",
        "حديث",
        "الويب",
        "الانترنت",
        "recherche",
        "chercher",
        "sources",
        "actualités",
        "récent",
    }

    def decide(self, understanding: Dict[str, Any]) -> Dict[str, Any]:
        """
        Produce task decisions exclusively from the Understanding Contract.
        """

        if not isinstance(understanding, dict):
            understanding = {}

        intent = self._text(understanding.get("intent"))
        domain = self._text(understanding.get("domain"))
        question_type = self._text(
            understanding.get("question_type")
        )

        keywords = self._values(
            understanding.get("keywords")
        )
        entities = self._values(
            understanding.get("entities")
        )
        relations = self._values(
            understanding.get("relations")
        )

        signals = self._build_signals(
            intent=intent,
            domain=domain,
            question_type=question_type,
            keywords=keywords,
            entities=entities,
            relations=relations,
        )

        requires_comparison = self._contains_any(
            signals,
            self.COMPARISON_TERMS,
        )

        requires_programming = self._contains_any(
            signals,
            self.PROGRAMMING_TERMS,
        )

        requires_reasoning = self._contains_any(
            signals,
            self.REASONING_TERMS,
        )

        requires_vision = self._contains_any(
            signals,
            self.VISION_TERMS,
        )

        requires_research = self._contains_any(
            signals,
            self.RESEARCH_TERMS,
        )

        # Intent/question type can be stronger than keyword evidence.
        comparison_marker = any(
            marker in question_type
            for marker in (
                "comparison",
                "compare",
                "مقارنة",
                "comparaison",
            )
        )

        programming_marker = any(
            marker in (intent, domain, question_type)
            for marker in (
                "program",
                "programming",
                "code",
                "coding",
                "software",
                "developer",
                "برمج",
                "كود",
                "تطوير",
                "programmation",
            )
        )

        reasoning_marker = any(
            marker in (intent, domain, question_type)
            for marker in (
                "reason",
                "reasoning",
                "logic",
                "analysis",
                "استدلال",
                "منطق",
                "تحليل",
                "raisonnement",
                "logique",
                "analyse",
            )
        )

        vision_marker = any(
            marker in (intent, domain, question_type)
            for marker in (
                "vision",
                "visual",
                "image",
                "صور",
                "صورة",
                "رؤية",
                "image",
                "visuel",
            )
        )

        requires_comparison = (
            requires_comparison or comparison_marker
        )

        requires_programming = (
            requires_programming or programming_marker
        )

        requires_reasoning = (
            requires_reasoning or reasoning_marker
        )

        requires_vision = (
            requires_vision or vision_marker
        )

        complex_task = any(
            (
                requires_comparison,
                requires_programming,
                requires_reasoning,
                requires_vision,
            )
        )

        if requires_programming:
            task_type = "programming"
        elif requires_comparison:
            task_type = "comparison"
        elif requires_reasoning:
            task_type = "reasoning"
        elif requires_vision:
            task_type = "vision"
        elif requires_research:
            task_type = "research"
        else:
            task_type = "general"

        if requires_vision:
            execution_mode = "vision"
        elif requires_programming:
            execution_mode = "programming"
        elif requires_reasoning:
            execution_mode = "reasoning"
        elif requires_comparison:
            execution_mode = "comparison"
        elif requires_research:
            execution_mode = "research"
        else:
            execution_mode = "direct"

        if requires_research:
            generation_mode = "research_then_generate"
        elif complex_task:
            generation_mode = "complex_generate"
        else:
            generation_mode = "direct_generate"

        return {
            "task_type": task_type,
            "execution_mode": execution_mode,
            "generation_mode": generation_mode,

            "complex_task": complex_task,
            "requires_comparison": requires_comparison,
            "requires_programming": requires_programming,
            "requires_reasoning": requires_reasoning,
            "requires_vision": requires_vision,
            "requires_research": requires_research,

            "requires_retrieval": True,
            "requires_memory": True,

            "decision_source": "understanding_contract",
        }

    @staticmethod
    def _text(value: Any) -> str:
        return str(value or "").strip().lower()

    @staticmethod
    def _values(value: Any) -> list[str]:
        if value is None:
            return []

        if isinstance(value, (list, tuple, set)):
            values = value
        else:
            values = [value]

        result: list[str] = []

        for item in values:
            if isinstance(item, dict):
                for key in (
                    "name",
                    "value",
                    "text",
                    "entity",
                    "type",
                    "relation",
                ):
                    candidate = item.get(key)
                    if candidate:
                        result.append(str(candidate).lower())
            else:
                text = str(item).strip().lower()
                if text:
                    result.append(text)

        return result

    @classmethod
    def _build_signals(
        cls,
        *,
        intent: str,
        domain: str,
        question_type: str,
        keywords: Iterable[str],
        entities: Iterable[str],
        relations: Iterable[str],
    ) -> Set[str]:

        signals: Set[str] = set()

        for value in (
            intent,
            domain,
            question_type,
            *keywords,
            *entities,
            *relations,
        ):
            text = str(value or "").strip().lower()

            if not text:
                continue

            signals.add(text)

            for token in text.replace("_", " ").replace("-", " ").split():
                token = token.strip(".,:;!?؟()[]{}\"'`")
                if token:
                    signals.add(token)

        return signals

    @staticmethod
    def _contains_any(
        signals: Set[str],
        terms: Set[str],
    ) -> bool:

        if signals.intersection(terms):
            return True

        for signal in signals:
            for term in terms:
                if (
                    len(term) >= 4
                    and term in signal
                ):
                    return True

        return False


decision_router = DecisionRouter()

__all__ = [
    "DecisionRouter",
    "decision_router",
]

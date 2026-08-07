import os
import re


class LLMRouter:
    """
    Selects the cheapest suitable provider for each request.

    Strategy:
    - local: Quavron knowledge / simple known answers
    - openai: programming, reasoning, comparison, analysis, vision
    """

    def __init__(self):
        pass

    def openai_available(self):
        return bool(os.environ.get("OPENAI_API_KEY", "").strip())

    def _contains_any(self, text, words):
        return any(word in text for word in words)

    def is_comparison(self, task):
        comparison_words = [
            "compare",
            "comparison",
            "versus",
            "vs",
            "difference",
            "differences",
            "قارن",
            "مقارنة",
            "الفرق",
            "ما الفرق",
            "ما هو الفرق",
            "أيهما",
            "أفضل من",
            "مقابل",
        ]
        return self._contains_any(task, comparison_words)

    def is_reasoning(self, task):
        reasoning_words = [
            "why",
            "how",
            "explain",
            "analyze",
            "analysis",
            "reason",
            "reasoning",
            "explain why",
            "لماذا",
            "كيف",
            "اشرح",
            "فسر",
            "حلل",
            "تحليل",
            "استنتج",
            "استنتاج",
        ]

        # "كيف" وحدها ليست كافية دائمًا لاستخدام OpenAI.
        # أسئلة Quavron الإجرائية البسيطة تبقى محلية.
        if task.strip().startswith("كيف") and not self._contains_any(
            task,
            [
                "قارن",
                "حلل",
                "اشرح",
                "فسر",
                "استنتج",
            ],
        ):
            return False

        return self._contains_any(task, reasoning_words)

    def is_programming(self, task):
        programming_words = [
            "code",
            "coding",
            "programming",
            "program",
            "python",
            "javascript",
            "typescript",
            "react",
            "next.js",
            "nextjs",
            "node",
            "api",
            "debug",
            "bug",
            "algorithm",
            "sql",
            "html",
            "css",
            "git",
            "كود",
            "برمجة",
            "مبرمج",
            "برمجية",
            "خوارزمية",
            "بايثون",
            "جافاسكربت",
            "تايبسكريبت",
            "رياكت",
            "تصحيح",
            "خطأ برمجي",
        ]
        return self._contains_any(task, programming_words)

    def is_vision_or_advanced_analysis(self, task):
        advanced_words = [
            "image",
            "vision",
            "screenshot",
            "photo",
            "picture",
            "architecture",
            "design",
            "صورة",
            "لقطة شاشة",
            "تصميم",
            "معمارية",
        ]
        return self._contains_any(task, advanced_words)

    def select(self, task):
        task = str(task).lower().strip()

        # OpenAI is optional.
        # QAI must continue working without it.
        if not self.openai_available():
            return "local"

        # Complex tasks should use the reasoning model.
        if self.is_comparison(task):
            return "openai"

        if self.is_vision_or_advanced_analysis(task):
            return "openai"

        if self.is_programming(task):
            return "openai"

        if self.is_reasoning(task):
            return "openai"

        # Local engine remains the default for known Quavron knowledge.
        return "local"


router = LLMRouter()

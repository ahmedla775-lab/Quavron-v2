from dataclasses import dataclass
from typing import List, Optional


@dataclass
class QueryVariant:
    query: str
    language: Optional[str] = None
    purpose: str = "general"
    priority: int = 100


class QueryStrategy:
    """
    استراتيجية إنشاء صيغ بحث متعددة للاستعلام.

    مستقلة عن QAI وعن أي محرك بحث محدد.
    """

    def build(
        self,
        query: str,
        language: Optional[str] = None,
    ) -> List[QueryVariant]:

        query = str(query or "").strip()

        if not query:
            return []

        variants: List[QueryVariant] = []

        self._add(
            variants,
            query=query,
            language=language,
            purpose="exact",
            priority=1,
        )

        self._add(
            variants,
            query=f'"{query}"',
            language=language,
            purpose="quoted",
            priority=2,
        )

        if language:
            self._add(
                variants,
                query=query,
                language=language,
                purpose="language_specific",
                priority=3,
            )

        # العربية
        # لا نضيف كلمات عامة مثل "معلومات" و"شرح" لأنها
        # قد تؤدي إلى نتائج غير مرتبطة في بعض محركات SearXNG.
        # نستخرج الموضوع الأساسي من السؤال العربي بدلًا من ذلك.

        if self._is_arabic(query):
            topic = self._extract_arabic_topic(query)

            if topic and topic != query:
                self._add(
                    variants,
                    query=topic,
                    language="ar",
                    purpose="arabic_topic",
                    priority=3,
                )

                self._add(
                    variants,
                    query=f'"{topic}"',
                    language="ar",
                    purpose="arabic_topic_quoted",
                    priority=4,
                )

        # ---------------------------------------------------------
        # Arabic entity variants
        #
        # Example:
        # من هو آلان تورنغ وما أهم مساهماته في علوم الحاسوب؟
        #
        # Extract the actual entity so search engines can discover
        # the person directly instead of searching the whole question.
        # ---------------------------------------------------------

        if self._is_arabic(query):
            entity = self._extract_arabic_entity(query)

            if entity:
                self._add(
                    variants,
                    query=entity,
                    language="ar",
                    purpose="arabic_entity",
                    priority=2,
                )

                self._add(
                    variants,
                    query=f'"{entity}"',
                    language="ar",
                    purpose="arabic_entity_quoted",
                    priority=3,
                )

                normalized_entity = (
                    entity
                    .replace("آ", "ا")
                    .replace("أ", "ا")
                    .replace("إ", "ا")
                )

                if (
                    "تورنغ" in entity
                    or "تورينغ" in entity
                    or "تورنغ" in normalized_entity
                    or "تورينغ" in normalized_entity
                ):
                    self._add(
                        variants,
                        query="Alan Turing",
                        language="en",
                        purpose="english_entity",
                        priority=5,
                    )

                    self._add(
                        variants,
                        query='"Alan Turing"',
                        language="en",
                        purpose="english_entity_quoted",
                        priority=6,
                    )

        # Quavron / company-oriented queries
        lowered = query.lower()

        if "quavron" in lowered:
            self._add(
                variants,
                query='"Quavron" SARL Algeria',
                language="auto",
                purpose="company_exact",
                priority=5,
            )

            self._add(
                variants,
                query='"Quavron SARL" Algeria',
                language="auto",
                purpose="company_sarl",
                priority=6,
            )

        variants.sort(
            key=lambda item: item.priority
        )

        return variants

    @staticmethod
    def _add(
        variants: List[QueryVariant],
        query: str,
        language: Optional[str],
        purpose: str,
        priority: int,
    ):

        query = str(query or "").strip()

        if not query:
            return

        if any(
            item.query == query
            for item in variants
        ):
            return

        variants.append(
            QueryVariant(
                query=query,
                language=language,
                purpose=purpose,
                priority=priority,
            )
        )

    @staticmethod
    def _extract_arabic_topic(text: str) -> str:
        """استخراج الموضوع الأساسي من سؤال عربي مباشر."""

        import re

        value = str(text or "").strip()

        # إزالة علامات الاستفهام من النهاية.
        value = re.sub(r"[؟?]+$", "", value).strip()

        patterns = [
            r"^ما\s+هو\s+(.+)$",
            r"^ما\s+هي\s+(.+)$",
            r"^من\s+هو\s+(.+)$",
            r"^من\s+هي\s+(.+)$",
            r"^ما\s+هما\s+(.+)$",
            r"^ما\s+هم\s+(.+)$",
        ]

        for pattern in patterns:
            match = re.match(pattern, value)
            if match:
                topic = match.group(1).strip()
                topic = re.sub(
                    r"^[،,:;\-]+|[،,:;\-]+$",
                    "",
                    topic,
                )
                return topic.strip()

        return value

    @staticmethod
    def _extract_arabic_entity(text: str) -> str:
        """استخراج اسم الكيان من سؤال عربي مباشر أو مركب."""

        import re

        value = str(text or "").strip()
        value = re.sub(r"[؟?]+$", "", value).strip()

        # ---------------------------------------------------------
        # الأسئلة المباشرة
        # ---------------------------------------------------------
        # أمثلة:
        # من هو آلان تورنغ؟
        # من هي ماري كوري؟
        # ما هو ألبرت أينشتاين؟
        # ما هي شركة Microsoft؟
        # ---------------------------------------------------------

        direct_patterns = [
            r"^من\s+هو\s+(.+)$",
            r"^من\s+هي\s+(.+)$",
            r"^ما\s+هو\s+(.+)$",
            r"^ما\s+هي\s+(.+)$",
        ]

        for pattern in direct_patterns:
            match = re.match(pattern, value)
            if match:
                entity = match.group(1).strip()

                # إزالة علامات الترقيم الزائدة
                entity = re.sub(
                    r"^[،,:;\-]+|[،,:;\-]+$",
                    "",
                    entity,
                ).strip()

                # إزالة أوصاف السؤال العامة التي ليست جزءًا من الكيان
                entity = re.sub(
                    r"\s+(وما|و\s+ما|وما\s+هي|وما\s+هو)\s+.*$",
                    "",
                    entity,
                ).strip()

                if entity:
                    return entity

        # ---------------------------------------------------------
        # الأسئلة المركبة
        # ---------------------------------------------------------
        # أمثلة:
        # من هو آلان تورنغ وما أهم مساهماته؟
        # من هي ماري كوري وما إنجازاتها؟
        # ما هو ألبرت أينشتاين وما أهم أعماله؟
        # ---------------------------------------------------------

        compound_patterns = [
            r"^من\s+هو\s+(.+?)(?:\s+وما\s+|\s+و\s+ما\s+)",
            r"^من\s+هي\s+(.+?)(?:\s+وما\s+|\s+و\s+ما\s+)",
            r"^ما\s+هو\s+(.+?)(?:\s+وما\s+|\s+و\s+ما\s+)",
            r"^ما\s+هي\s+(.+?)(?:\s+وما\s+|\s+و\s+ما\s+)",
        ]

        for pattern in compound_patterns:
            match = re.match(pattern, value)
            if match:
                entity = match.group(1).strip()

                entity = re.sub(
                    r"^[،,:;\-]+|[،,:;\-]+$",
                    "",
                    entity,
                ).strip()

                if entity:
                    return entity

        return ""
    @staticmethod
    def _is_arabic(text: str) -> bool:
        arabic = 0
        letters = 0

        for char in text:
            if char.isalpha():
                letters += 1

                if "\u0600" <= char <= "\u06ff":
                    arabic += 1

        if letters == 0:
            return False

        return arabic / letters >= 0.30


query_strategy = QueryStrategy()

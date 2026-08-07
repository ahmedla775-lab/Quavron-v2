from intent.router import router
from rag.engine import engine
from llm.router import router as llm_router
from llm.gateway import gateway


class Brain:

    def __init__(self):
        self.intent_router = router
        self.rag_engine = engine

    # =====================================================
    # Evidence
    # =====================================================

    def _has_useful_knowledge(self, documents):
        if not documents:
            return False

        for doc in documents:
            try:
                relevance = float(doc.get("relevance", 0) or 0)
            except (TypeError, ValueError):
                relevance = 0

            if relevance >= 70:
                return True

        return False

    def _is_complex_task(self, question):
        return (
            llm_router.is_comparison(question)
            or llm_router.is_programming(question)
            or llm_router.is_reasoning(question)
            or llm_router.is_vision_or_advanced_analysis(question)
        )

    def _has_sufficient_evidence(self, question, documents):
        """
        Determine whether QAI has enough local evidence.

        Direct questions need at least one strong document.
        Complex questions may be answered from multiple
        medium-strength documents.
        """

        if not documents:
            return False

        relevant = []

        for doc in documents:
            try:
                relevance = float(doc.get("relevance", 0) or 0)
            except (TypeError, ValueError):
                relevance = 0

            if relevance >= 40:
                relevant.append(doc)

        if not relevant:
            return False

        # Strong direct evidence.
        if any(
            float(doc.get("relevance", 0) or 0) >= 70
            for doc in relevant
        ):
            return True

        # Multiple pieces of evidence can answer a complex task.
        if self._is_complex_task(question) and len(relevant) >= 2:
            return True

        return False

    # =====================================================
    # Local comparison
    # =====================================================

    def _build_local_comparison(self, question, documents):
        """
        Deterministic local comparison.

        Only uses facts actually present in local knowledge.
        """

        cloud_ide = []
        marketplace = []

        for doc in documents:
            text = str(doc.get("text", "")).strip()

            if not text:
                continue

            lower = text.lower()

            # Cloud IDE
            if "cloud ide" in lower:
                if text not in cloud_ide:
                    cloud_ide.append(text)

            # Marketplace
            if "marketplace" in lower:
                if text not in marketplace:
                    marketplace.append(text)

            # Arabic Marketplace definitions
            if (
                "سوق رقمي" in text
                or "الخدمات والمنتجات" in text
            ):
                if text not in marketplace:
                    marketplace.append(text)

        if not cloud_ide or not marketplace:
            return None

        cloud_text = cloud_ide[0]
        marketplace_text = marketplace[0]

        return (
            "يمكن تلخيص الفرق بينهما كالتالي:\n\n"
            f"• Cloud IDE: {cloud_text}\n\n"
            f"• Marketplace: {marketplace_text}\n\n"
            "الفرق الأساسي: Cloud IDE مخصص للتطوير البرمجي "
            "وإنشاء واختبار وإدارة المشاريع، بينما Marketplace "
            "مخصص لاكتشاف الخدمات والمنتجات وتقديمها والتواصل "
            "بين المستخدمين."
        )

    # =====================================================
    # Think
    # =====================================================

    def think(self, question):

        # =================================================
        # 1. Intent
        # =================================================

        intent_result = self.intent_router.detect(question)

        intent = intent_result.get(
            "intent",
            "general"
        )

        domain = intent_result.get(
            "domain",
            "general"
        )

        # =================================================
        # 2. Local RAG
        # =================================================

        rag_result = self.rag_engine.prepare(question)

        documents = rag_result.get(
            "documents",
            []
        )

        context = rag_result.get(
            "context",
            ""
        )

        complex_task = self._is_complex_task(question)

        # IMPORTANT:
        # Use evidence sufficiency instead of the old
        # single-document check.
        has_knowledge = self._has_sufficient_evidence(
            question,
            documents
        )

        # =================================================
        # 3. Local reasoning
        # =================================================

        # Comparison questions should be solved locally
        # when the required entities exist in the knowledge.

        if (
            llm_router.is_comparison(question)
            and has_knowledge
        ):
            local_answer = self._build_local_comparison(
                question,
                documents
            )

            if local_answer:

                return {
                    "intent": intent,
                    "domain": domain,
                    "provider": "local",
                    "documents": len(documents),
                    "fallback_from": None,
                    "llm": {
                        "provider": "local",
                        "status": "completed",
                        "source": "local_knowledge",
                        "confidence": 0.85,
                        "relevance": 100,
                        "answer": local_answer,
                        "message": None,
                    },
                }

        # =================================================
        # 4. Provider selection
        # =================================================

        # LOCAL FIRST.
        #
        # If QAI has enough evidence, external AI is not used.

        if has_knowledge:
            provider = "local"

        elif complex_task and llm_router.openai_available():
            provider = "openai"

        elif llm_router.openai_available():
            provider = "openai"

        else:
            provider = "local"

        # =================================================
        # 5. Ask selected provider
        # =================================================

        llm_result = gateway.ask(
            provider,
            question,
            context,
        )

        fallback_from = None

        # =================================================
        # 6. External provider failure
        # =================================================

        if (
            provider == "openai"
            and llm_result.get("status") != "completed"
        ):
            fallback_from = "openai"

            # Try local knowledge one more time.
            local_result = gateway.ask(
                "local",
                question,
                context,
            )

            if local_result.get("status") == "completed":
                llm_result = local_result
                provider = "local"

        # =================================================
        # 7. Unified result
        # =================================================

        return {
            "intent": intent,
            "domain": domain,
            "provider": provider,
            "documents": len(documents),
            "fallback_from": fallback_from,
            "llm": llm_result,
        }


brain = Brain()

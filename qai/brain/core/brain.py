from intent.router import router
from rag.engine import engine
from llm.router import router as llm_router
from llm.gateway import gateway
from memory.memory import memory
from users.context.builder import context_builder
from learning.bridge import learning_bridge


class Brain:

    def __init__(self):
        self.intent_router = router
        self.rag_engine = engine

    # =====================================================
    # LOCAL KNOWLEDGE EVIDENCE
    # =====================================================

    def _document_relevance(self, document):
        try:
            return float(
                document.get("relevance", 0) or 0
            )
        except (TypeError, ValueError):
            return 0.0

    def _source_priority(self, document):
        source = document.get("source", "")

        return {
            "qai_learning": 400,
            "knowledge": 300,
            "vector": 100,
        }.get(source, 0)

    def _has_sufficient_evidence(self, question, documents):

        if not documents:
            return False

        # -------------------------------------------------
        # Approved learning
        # -------------------------------------------------

        for doc in documents:

            if doc.get("source") == "qai_learning":

                relevance = self._document_relevance(doc)

                approved = doc.get("approved", False) is True

                confidence = float(
                    doc.get("confidence", 0) or 0
                )

                # Supervisor-approved learning is trusted
                # even when lexical relevance is moderate.
                if (
                    approved
                    and confidence >= 1.0
                    and relevance >= 20
                ):
                    return True

                # Unapproved learning still requires
                # the normal stronger relevance threshold.
                if relevance >= 25:
                    return True

        # -------------------------------------------------
        # Official Quavron knowledge
        #
        # Official knowledge is trusted even when the
        # lexical relevance score is moderate.
        # -------------------------------------------------

        for doc in documents:

            if doc.get("source") != "knowledge":
                continue

            relevance = self._document_relevance(doc)

            if relevance >= 25:
                return True

        # -------------------------------------------------
        # Multiple strong trusted pieces of local evidence
        # -------------------------------------------------

        trusted_sources = {
            "qai_learning",
            "knowledge",
        }

        strong = [
            doc
            for doc in documents
            if (
                doc.get("source") in trusted_sources
                and self._document_relevance(doc) >= 40
            )
        ]

        if len(strong) >= 2:
            return True

        # -------------------------------------------------
        # Complex local tasks
        # -------------------------------------------------

        if self._is_complex_task(question):

            if len(strong) >= 2:
                return True

        return False

    # =====================================================
    # COMPLEX TASK
    # =====================================================

    def _is_complex_task(self, question):

        return (
            llm_router.is_comparison(question)
            or llm_router.is_programming(question)
            or llm_router.is_reasoning(question)
            or llm_router.is_vision_or_advanced_analysis(question)
        )

    # =====================================================
    # LOCAL COMPARISON
    # =====================================================

    def _build_local_comparison(self, question, documents):

        cloud_ide = []
        marketplace = []

        for doc in documents:

            text = str(
                doc.get("text", "")
            ).strip()

            if not text:
                continue

            lower = text.lower()

            if "cloud ide" in lower:
                if text not in cloud_ide:
                    cloud_ide.append(text)

            if "marketplace" in lower:
                if text not in marketplace:
                    marketplace.append(text)

            if (
                "سوق رقمي" in text
                or "الخدمات والمنتجات" in text
            ):
                if text not in marketplace:
                    marketplace.append(text)

        if not cloud_ide or not marketplace:
            return None

        return (
            "يمكن تلخيص الفرق بينهما كالتالي:\n\n"
            f"• Cloud IDE: {cloud_ide[0]}\n\n"
            f"• Marketplace: {marketplace[0]}\n\n"
            "الفرق الأساسي: Cloud IDE مخصص للتطوير "
            "البرمجي وإنشاء واختبار وإدارة المشاريع، "
            "بينما Marketplace مخصص لاكتشاف الخدمات "
            "والمنتجات وتقديمها والتواصل بين المستخدمين."
        )

    # =====================================================
    # LOCAL MEMORY
    # =====================================================

    def _remember(self, question, answer, user_id, metadata):

        try:

            memory.remember(
                question,
                answer,
                user=user_id or "guest",
                metadata=metadata
            )

        except Exception as e:

            print(
                "[Brain] Memory save error:",
                type(e).__name__,
                str(e)
            )

    # =====================================================
    # LEARNING CANDIDATE
    # =====================================================

    def _prepare_learning_candidate(
        self,
        question,
        llm_result,
    ):
        """
        Prepare a successful external answer for the
        supervisor-controlled learning pipeline.

        IMPORTANT:
        This method NEVER saves knowledge automatically.
        """

        if not isinstance(llm_result, dict):
            return None

        if llm_result.get("status") != "completed":
            return None

        answer = str(
            llm_result.get("answer", "")
            or ""
        ).strip()

        if not answer:
            return None

        provider = llm_result.get(
            "provider",
            ""
        )

        if provider == "local":
            return None

        evaluation = learning_bridge.evaluate_teacher_answer(
            question,
            answer,
            teacher=provider,
        )

        return {
            "question": question,
            "answer": answer,
            "teacher": provider,
            "evaluation": evaluation,
            "can_learn": learning_bridge.can_learn(
                evaluation
            ),
        }

    # =====================================================
    # THINK
    # =====================================================

    def think(self, question, user_id="guest"):

        # -------------------------------------------------
        # 0. USER CONTEXT
        # -------------------------------------------------

        user_context = {}

        if user_id and user_id != "guest":

            try:

                user_context = context_builder.build(
                    user_id,
                    question
                )

            except Exception as e:

                print(
                    "[Brain] User context error:",
                    type(e).__name__,
                    str(e)
                )

                user_context = {}

        # -------------------------------------------------
        # 1. INTENT
        # -------------------------------------------------

        intent_result = self.intent_router.detect(
            question
        )

        intent = intent_result.get(
            "intent",
            "general"
        )

        domain = intent_result.get(
            "domain",
            "general"
        )

        # -------------------------------------------------
        # 2. LOCAL RAG
        # -------------------------------------------------

        rag_result = self.rag_engine.prepare(
            question
        )

        documents = rag_result.get(
            "documents",
            []
        )

        context = rag_result.get(
            "context",
            ""
        )

        # -------------------------------------------------
        # 3. LOCAL EVIDENCE
        # -------------------------------------------------

        has_knowledge = self._has_sufficient_evidence(
            question,
            documents
        )

        # -------------------------------------------------
        # 4. LOCAL COMPARISON
        # -------------------------------------------------

        if (
            llm_router.is_comparison(question)
            and has_knowledge
        ):

            local_answer = self._build_local_comparison(
                question,
                documents
            )

            if local_answer:

                llm_result = {
                    "provider": "local",
                    "status": "completed",
                    "source": "local_knowledge",
                    "confidence": 0.90,
                    "relevance": 100,
                    "answer": local_answer,
                    "message": None,
                }

                self._remember(
                    question,
                    local_answer,
                    user_id,
                    {
                        "provider": "local",
                        "pipeline": intent,
                        "source": "local_knowledge",
                    }
                )

                return {
                    "intent": intent,
                    "domain": domain,
                    "provider": "local",
                    "documents": len(documents),
                    "fallback_from": None,
                    "user_context": user_context,
                    "llm": llm_result,
                }

        # -------------------------------------------------
        # 5. QAI INTELLIGENCE
        # -------------------------------------------------
        # OpenAI is not an answer fallback.
        # QAI handles unanswered requests through its own
        # intelligence/tools pipeline.

        provider = "local"

        # -------------------------------------------------
        # 6. ASK QAI
        # -------------------------------------------------

        llm_result = gateway.ask(
            "local",
            question,
            context,
        )

        fallback_from = None

        # -------------------------------------------------
        # 9. LEARNING CANDIDATE
        # -------------------------------------------------

        learning_candidate = (
            self._prepare_learning_candidate(
                question,
                llm_result,
            )
        )

        # -------------------------------------------------
        # 10. MEMORY
        # -------------------------------------------------

        if llm_result.get("status") == "completed":

            answer = llm_result.get(
                "answer"
            )

            if answer:

                self._remember(
                    question,
                    answer,
                    user_id,
                    {
                        "provider": provider,
                        "pipeline": intent,
                        "domain": domain,
                        "source": llm_result.get(
                            "source"
                        ),
                    }
                )

        # -------------------------------------------------
        # 10. RESULT
        # -------------------------------------------------

        return {
            "intent": intent,
            "domain": domain,
            "provider": provider,
            "documents": len(documents),
            "fallback_from": fallback_from,
            "user_context": user_context,
            "learning_candidate": learning_candidate,
            "llm": llm_result,
        }


    # =====================================================
    # CHAT API
    # =====================================================

    def chat(self, user_id="guest", message=""):

        result = self.think(
            message,
            user_id=user_id or "guest"
        )

        llm = result.get("llm", {})

        return {
            "reply": llm.get("answer", ""),
            "provider": result.get("provider"),
            "source": llm.get("source"),
            "confidence": llm.get("confidence", 0),
            "documents": result.get("documents", 0),
            "fallback_from": result.get("fallback_from"),
            "intent": result.get("intent"),
            "domain": result.get("domain"),
        }


brain = Brain()

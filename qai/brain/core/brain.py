from qai.intent.router import router
from qai.rag.engine import engine
from qai.llm.router import router as llm_router
from qai.llm.gateway import gateway
from qai.memory.memory import memory
from qai.users.context.builder import context_builder
from qai.learning.bridge import learning_bridge
from qai.brain.core.research_bridge import research_bridge
from qai.understanding import parse_question


class Brain:

    def __init__(self):
        self.intent_router = router
        self.rag_engine = engine

    # =====================================================
    # UNDERSTANDING CONTRACT
    # =====================================================

    def _build_understanding_contract(
        self,
        question,
        understanding,
        legacy_intent_result=None,
    ):
        """
        Normalize Understanding output into the stable Brain contract.

        Understanding is authoritative for semantic understanding.
        Legacy Intent Router remains a compatibility fallback.
        Downstream Brain stages consume this contract only.
        """

        if not isinstance(understanding, dict):
            understanding = {}

        legacy = (
            legacy_intent_result
            if isinstance(legacy_intent_result, dict)
            else {}
        )

        original = understanding.get(
            "original",
            question,
        )

        normalized = understanding.get(
            "normalized",
            str(question or "").strip(),
        )

        language = (
            understanding.get("language", "unknown")
            or "unknown"
        )

        question_type = (
            understanding.get("question_type", "general")
            or "general"
        )

        understanding_intent = (
            understanding.get("intent", "general")
            or "general"
        )

        understanding_intent_confidence = float(
            understanding.get(
                "intent_confidence",
                0.0,
            ) or 0.0
        )

        understanding_confidence = float(
            understanding.get(
                "confidence",
                0.0,
            ) or 0.0
        )

        # -------------------------------------------------
        # INTENT AUTHORITY
        # -------------------------------------------------

        if (
            understanding_intent
            and understanding_intent != "general"
            and understanding_intent_confidence > 0.0
        ):
            intent = understanding_intent
            intent_source = "understanding"

        elif (
            legacy.get("intent")
            and legacy.get("intent") != "general"
        ):
            intent = legacy.get("intent")
            intent_source = "legacy_router_fallback"

        else:
            intent = "general"
            intent_source = "default"

        # -------------------------------------------------
        # DOMAIN
        # -------------------------------------------------

        domain = (
            understanding.get("domain")
            or legacy.get("domain")
            or "general"
        )

        router_confidence = float(
            legacy.get(
                "confidence",
                legacy.get(
                    "intent_confidence",
                    0.0,
                ),
            ) or 0.0
        )

        contract = {
            "original": original,
            "normalized": normalized,

            "language": language,
            "question_type": question_type,

            "intent": intent,
            "intent_source": intent_source,

            "intent_confidence": understanding_intent_confidence,
            "confidence": understanding_confidence,

            "domain": domain,

            "entities": understanding.get(
                "entities",
                [],
            ) or [],

            "relations": understanding.get(
                "relations",
                [],
            ) or [],

            "temporal": understanding.get(
                "temporal",
                [],
            ) or [],

            "numbers": understanding.get(
                "numbers",
                [],
            ) or [],

            "locations": understanding.get(
                "locations",
                [],
            ) or [],

            "subject": understanding.get(
                "subject",
            ),

            "target": understanding.get(
                "target",
            ),

            "keywords": understanding.get(
                "keywords",
                [],
            ) or [],

            "is_question": bool(
                understanding.get(
                    "is_question",
                    False,
                )
            ),

            "question_markers": understanding.get(
                "question_markers",
                [],
            ) or [],

            "meta": understanding.get(
                "meta",
                {},
            ) or {},

            # Compatibility information is isolated.
            "router_compatibility": {
                "intent": legacy.get(
                    "intent",
                    "general",
                ),
                "domain": legacy.get(
                    "domain",
                    "general",
                ),
                "confidence": router_confidence,
            },
        }

        # -------------------------------------------------
        # STABLE BRAIN SIGNAL
        # -------------------------------------------------

        contract["brain_signal"] = {
            "language": language,
            "question_type": question_type,
            "intent": intent,
            "intent_confidence": understanding_intent_confidence,
            "confidence": understanding_confidence,
            "domain": domain,
            "intent_source": intent_source,
        }

        return contract

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

    # =====================================================
    # ORCHESTRATOR
    # =====================================================

    def _build_decision(
        self,
        question,
        understanding,
    ):
        """
        Convert the Understanding Contract into a stable
        high-level processing decision.

        This is a routing decision only. It does not generate
        answers and does not modify RAG, Research, Gateway,
        LocalDriver, Learning or Memory.
        """
        understanding = (
            understanding
            if isinstance(understanding, dict)
            else {}
        )

        intent = (
            understanding.get("intent")
            or "general"
        )

        question_type = (
            understanding.get("question_type")
            or "general"
        )

        language = (
            understanding.get("language")
            or "unknown"
        )

        confidence = float(
            understanding.get("confidence", 0.0)
            or 0.0
        )

        entities = understanding.get(
            "entities",
            [],
        ) or []

        temporal = understanding.get(
            "temporal",
            [],
        ) or []

        is_question = bool(
            understanding.get(
                "is_question",
                False,
            )
        )

        # -------------------------------------------------
        # INTENT -> DECISION MODE
        # -------------------------------------------------
        # Understanding owns semantic intent.
        # Decision Router converts it into an execution mode.
        # It does not perform generation itself.
        # -------------------------------------------------

        if intent in {
            "comparison",
            "compare",
        }:
            mode = "comparison"

        elif intent in {
            "programming",
            "code",
            "coding",
            "debugging",
            "implementation",
        }:
            mode = "programming"

        elif intent in {
            "reasoning",
            "analysis",
            "logical_reasoning",
        }:
            mode = "reasoning"

        elif intent in {
            "research",
            "search",
            "information",
            "lookup",
            "fact_check",
        }:
            mode = "research"

        elif intent in {
            "definition",
            "define",
            "explanation",
            "explain",
        }:
            mode = "knowledge"

        elif intent in {
            "calculation",
            "calculate",
            "math",
            "numeric",
        }:
            mode = "calculation"

        elif intent in {
            "cause",
            "why",
            "causal",
        }:
            mode = "causal_reasoning"

        elif intent in {
            "how_to",
            "procedure",
            "instruction",
            "tutorial",
        }:
            mode = "procedural"

        elif intent in {
            "summary",
            "summarization",
            "summarize",
        }:
            mode = "summarization"

        elif intent in {
            "translation",
            "translate",
        }:
            mode = "translation"

        elif intent in {
            "classification",
            "classify",
        }:
            mode = "classification"

        elif intent in {
            "conversation",
            "chat",
            "greeting",
        }:
            mode = "conversation"

        elif question_type in {
            "comparison",
            "programming",
            "reasoning",
            "analysis",
            "definition",
            "calculation",
            "cause",
            "procedural",
            "summary",
            "translation",
        }:
            mode = question_type

        elif is_question:
            mode = "question"

        else:
            mode = "general"

        return {
            "mode": mode,
            "intent": intent,
            "question_type": question_type,
            "language": language,
            "confidence": confidence,
            "is_question": is_question,
            "entity_count": len(entities),
            "has_temporal": bool(temporal),
            "source": "understanding_contract",
        }

    def _build_orchestration_plan(
        self,
        question,
        understanding,
        intent,
        domain,
        has_knowledge,
        documents,
    ):
        """
        Central Brain orchestration decision.

        Understanding Contract is the semantic source of truth.

        The Orchestrator decides the processing path only.
        Existing RAG, Research, Gateway, LocalDriver,
        Learning and Memory remain unchanged.
        """

        # -------------------------------------------------
        # UNDERSTANDING CONTRACT
        # -------------------------------------------------
        # All semantic decisions are read from the Contract.
        # -------------------------------------------------

        understanding = (
            understanding
            if isinstance(understanding, dict)
            else {}
        )

        contract_intent = understanding.get(
            "intent",
            intent or "general",
        )

        contract_domain = understanding.get(
            "domain",
            domain or "general",
        )

        question_type = understanding.get(
            "question_type",
            "general",
        ) or "general"

        language = understanding.get(
            "language",
            "unknown",
        ) or "unknown"

        confidence = float(
            understanding.get(
                "confidence",
                0.0,
            ) or 0.0
        )

        intent_confidence = float(
            understanding.get(
                "intent_confidence",
                0.0,
            ) or 0.0
        )

        is_question = bool(
            understanding.get(
                "is_question",
                False,
            )
        )

        entities = understanding.get(
            "entities",
            [],
        ) or []

        temporal = understanding.get(
            "temporal",
            [],
        ) or []

        # -------------------------------------------------
        # COMPLEXITY
        # -------------------------------------------------
        # Complexity detection remains a task-level concern.
        # It may still use the original question because the
        # existing LLM Router exposes task classifiers based
        # on textual input.
        # This does NOT replace Understanding semantics.
        # -------------------------------------------------

        complex_task = self._is_complex_task(question)

        # -------------------------------------------------
        # EVIDENCE / RESEARCH
        # -------------------------------------------------

        research_if_insufficient = not bool(
            has_knowledge
        )

        generation_provider = "local"

        if has_knowledge:
            generation_source = "local_knowledge"
        elif research_if_insufficient:
            generation_source = "research"
        else:
            generation_source = "local"

        # -------------------------------------------------
        # FINAL ORCHESTRATION PLAN
        # -------------------------------------------------

        return {
            "mode": "local_first",

            # Understanding Contract
            "intent": contract_intent,
            "domain": contract_domain,
            "question_type": question_type,
            "language": language,
            "confidence": confidence,
            "intent_confidence": intent_confidence,
            "is_question": is_question,
            "entities": entities,
            "temporal": temporal,

            # Task / evidence state
            "complex_task": complex_task,
            "has_knowledge": bool(has_knowledge),
            "documents": len(documents or []),
            "research_if_insufficient": research_if_insufficient,

            # Generation
            "generation_provider": generation_provider,
            "generation_source": generation_source,

            # Contract traceability
            "understanding_source": "understanding_contract",
        }

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
        # -------------------------------------------------
        # 1. UNDERSTANDING
        # -------------------------------------------------
        # Understanding is the semantic source of truth.
        # Brain consumes the normalized Understanding Contract.
        # -------------------------------------------------

        try:
            understanding_raw = parse_question(question)

        except Exception as e:
            print(
                "[Brain] Understanding error:",
                type(e).__name__,
                str(e),
            )

            understanding_raw = {
                "original": question,
                "normalized": str(question or "").strip(),
                "language": "unknown",
                "question_type": "general",
                "intent": "general",
                "intent_confidence": 0.0,
                "entities": [],
                "relations": [],
                "temporal": [],
                "numbers": [],
                "locations": [],
                "subject": None,
                "target": None,
                "keywords": [],
                "confidence": 0.0,
                "is_question": False,
                "question_markers": [],
                "meta": {},
            }

        # -------------------------------------------------
        # 2. LEGACY INTENT ROUTER
        # -------------------------------------------------
        # Compatibility / fallback only.
        # It must not override valid Understanding.
        # -------------------------------------------------

        try:
            intent_result = self.intent_router.detect(question)

        except Exception as e:
            print(
                "[Brain] Intent Router error:",
                type(e).__name__,
                str(e),
            )

            intent_result = {
                "intent": "general",
                "domain": "general",
                "confidence": 0.0,
            }

        # -------------------------------------------------
        # 3. UNDERSTANDING CONTRACT
        # -------------------------------------------------
        # Single semantic contract consumed downstream.
        # -------------------------------------------------

        understanding = self._build_understanding_contract(
            question=question,
            understanding=understanding_raw,
            legacy_intent_result=intent_result,
        )

        # Brain decisions now consume the Contract.
        intent = understanding["intent"]
        domain = understanding["domain"]

        # -------------------------------------------------
        # 3. DECISION ROUTER
        # -------------------------------------------------
        # Understanding Contract is the semantic source of truth.
        # Decision routing is derived from the contract and does
        # not replace Understanding, RAG, Research, Gateway or
        # LocalDriver.
        try:
            decision = self._build_decision(
                question=question,
                understanding=understanding,
            )
        except Exception as e:
            print(
                "[Brain] Decision Router error:",
                type(e).__name__,
                str(e),
            )
            decision = {
                "mode": "general",
                "reason": "decision_router_error",
            }


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
        # 3. ORCHESTRATION PLAN
        # -------------------------------------------------

        orchestration_plan = self._build_orchestration_plan(
            question=question,
            understanding=understanding,
            intent=intent,
            domain=domain,
            has_knowledge=has_knowledge,
            documents=documents,
        )

        orchestration_plan["decision"] = decision


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
                    "understanding": understanding,
            "orchestration": orchestration_plan,
                    "provider": "local",
                    "documents": len(documents),
                    "fallback_from": None,
                    "user_context": user_context,
                    "llm": llm_result,
                }

        # -------------------------------------------------
        # 5. QAI RESEARCH
        # -------------------------------------------------
        # Local knowledge is insufficient.
        # Before returning "no answer", QAI may research
        # the question through the independent research
        # subsystem.
        #
        # Research is evidence discovery only.
        # It does NOT automatically become trusted knowledge.

        research_result = None
        research_used = False
        research_context = ""
        research_evidence_count = 0


        if orchestration_plan.get("research_if_insufficient", not has_knowledge):

            research_result = research_bridge.research(
                question,
                understanding=understanding,
                max_results=8,
                max_pages=5,
            )

            if research_result.get("success"):
                research_used = True
                research_evidence_count = int(
                    research_result.get("evidence_count", 0) or 0
                )


                research_context = (
                    research_result.get(
                        "context",
                        "",
                    )
                    or ""
                ).strip()

                if research_context:

                    context = (
                        f"{context}\n\n"
                        if context
                        else ""
                    ) + (
                        "=== QAI RESEARCH EVIDENCE ===\n"
                        + research_context
                    )

        # -------------------------------------------------


        # 6. QAI INTELLIGENCE
        # -------------------------------------------------
        # OpenAI is not an answer fallback.
        # QAI handles unanswered requests through its own
        # intelligence/tools pipeline.

        # -------------------------------------------------

        # 7. ASK QAI

        # -------------------------------------------------

        # Brain remains local-first.

        # Gateway/LocalDriver is responsible for generation.

        # -------------------------------------------------
        # 7. LLM ROUTER
        # -------------------------------------------------
        # The Brain decides the task; the LLM Router decides
        # which generation provider should handle it.

        try:
            provider = llm_router.select(question)
        except Exception as e:
            print(
                "[Brain] LLM Router error:",
                type(e).__name__,
                str(e),
            )
            provider = "local"

        orchestration_plan["generation_provider"] = provider
        orchestration_plan["research_used"] = research_used
        orchestration_plan["research_evidence_count"] = research_evidence_count


        # -------------------------------------------------
        # 8. GENERATION CONTEXT
        # -------------------------------------------------
        # Keep RAG + Research evidence and add user context
        # without changing the existing memory/context system.

        generation_context = context or ""

        if user_context:
            try:
                import json

                user_context_text = json.dumps(
                    user_context,
                    ensure_ascii=False,
                    indent=2,
                    default=str,
                )

                generation_context = (
                    f"{generation_context}\n\n"
                    if generation_context
                    else ""
                ) + (
                    "=== USER CONTEXT ===\n"
                    + user_context_text
                )

            except Exception as e:
                print(
                    "[Brain] User context serialization error:",
                    type(e).__name__,
                    str(e),
                )

        # -------------------------------------------------
        # 9. ASK QAI
        # -------------------------------------------------

        try:
            llm_result = gateway.ask(
                provider,
                question,
                generation_context,
            )

        except Exception as e:

            print(

                "[Brain] Generation error:",

                type(e).__name__,

                str(e),

            )


            llm_result = {

                "provider": provider,

                "status": "error",

                "source": "generation_error",

                "confidence": 0,

                "relevance": 0,

                "answer": "",

                "message": str(e),

            }


        if not isinstance(llm_result, dict):

            llm_result = {

                "provider": provider,

                "status": "error",

                "source": "invalid_generation_result",

                "confidence": 0,

                "relevance": 0,

                "answer": "",

                "message": "Invalid gateway response",

            }


        provider = llm_result.get(

            "provider",

            provider,

        ) or provider


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
            "understanding": understanding,
            "orchestration": orchestration_plan,
            "provider": provider,
            "documents": len(documents),
            "research_used": research_used,
            "research_evidence_count": research_evidence_count,
            "research_context_chars": len(research_context),
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

        # -------------------------------------------------
        # PUBLIC ANSWER CLEANUP
        # -------------------------------------------------
        # Internal research/RAG wrappers must NEVER be
        # exposed to the user as part of the final answer.
        # QAI Research Evidence is transport metadata only.
        # -------------------------------------------------
        import re as _public_answer_re

        _public_answer = str(
            llm.get("answer", "") or ""
        ).strip()

        _public_answer = _public_answer_re.sub(
            r"={2,}\s*QAI\s+RESEARCH\s+EVIDENCE\s*={2,}",
            " ",
            _public_answer,
            flags=_public_answer_re.IGNORECASE,
        )

        # Remove serialized research metadata if it leaked
        # into the final answer.
        _public_answer = _public_answer_re.sub(
            r"\b(?:source|title|url|content|snippet|text)\s*:\s*",
            " ",
            _public_answer,
            flags=_public_answer_re.IGNORECASE,
        )

        # Remove leaked URLs from research transport data.
        _public_answer = _public_answer_re.sub(
            r"https?://\S+",
            " ",
            _public_answer,
            flags=_public_answer_re.IGNORECASE,
        )

        # Normalize whitespace.
        _public_answer = _public_answer_re.sub(
            r"\s+",
            " ",
            _public_answer,
        ).strip()

        return {
            "reply": _public_answer,
            "provider": result.get("provider"),
            "source": llm.get("source"),
            "confidence": llm.get("confidence", 0),
            "documents": result.get("documents", 0),
            "fallback_from": result.get("fallback_from"),
            "intent": result.get("intent"),
            "domain": result.get("domain"),
            "understanding": result.get("understanding"),

            "orchestration": result.get("orchestration"),
        }


brain = Brain()

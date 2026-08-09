from __future__ import annotations

from typing import Any, Dict

from .coordinator import IntelligenceCoordinator
from .intent import IntentEngine
from .pipeline import IntelligencePipeline
from .response import ResponseEngine
from .knowledge_builder import KnowledgeBuilder
from .knowledge_parser import KnowledgeParser
from .knowledge.repository import KnowledgeRepository


class Intelligence:
    """
    Unified public interface for Quavron Intelligence.

    Coordinates intent detection, knowledge, reasoning,
    memory and response construction.
    """

    def __init__(
        self,
        coordinator: IntelligenceCoordinator,
        intent_engine: IntentEngine | None = None,
        response_engine: ResponseEngine | None = None,
        knowledge_repository: KnowledgeRepository | None = None,
        research_engine: Any | None = None,
    ):
        if coordinator is None:
            raise ValueError("coordinator cannot be None")

        self.coordinator = coordinator
        self.intent = intent_engine or IntentEngine()

        self.pipeline = IntelligencePipeline(
            coordinator,
            self.intent,
        )

        self.response = response_engine or ResponseEngine()

        self.knowledge_repository = (
            knowledge_repository
            if knowledge_repository is not None
            else KnowledgeRepository()
        )

        # Optional research engine. When supplied, it should share
        # the same KnowledgeRepository used by Intelligence.
        self.research_engine = research_engine

        # Research results already transferred to the learning coordinator.
        # This prevents repeated learning of the same research knowledge.
        self._learned_research_keys: set[str] = set()

    def learn(
        self,
        subject: str,
        value: Any,
        memory_type: str = "FACT",
        confidence: float = 1.0,
    ) -> Dict[str, Any]:

        return self.coordinator.learn(
            subject,
            value,
            memory_type=memory_type,
            confidence=confidence,
        )

    def recall(self, subject: str) -> Any:
        return self.coordinator.recall(subject)

    def _learn_research_result(self, result: Any) -> bool:
        """
        Transfer validated research knowledge into the learning coordinator.

        KnowledgeRepository remains the research storage layer.
        The coordinator receives the same validated knowledge for
        continuous learning and future recall.

        Returns True when at least one new knowledge item was learned.
        Returns False when the result is invalid, unsuccessful, empty,
        or already learned.
        """
        if result is None:
            return False

        if not getattr(result, "success", False):
            return False

        knowledge = getattr(result, "knowledge", None) or []

        if not knowledge:
            return False

        learned_any = False

        for item in knowledge:
            statement = str(
                getattr(item, "statement", "") or ""
            ).strip()

            subject = str(
                getattr(item, "subject", "") or ""
            ).strip()

            if not statement or not subject:
                continue

            key = (
                f"{subject.strip().lower()}::"
                f"{statement.strip().lower()}"
            )

            if key in self._learned_research_keys:
                continue

            confidence = float(
                getattr(item, "confidence", 1.0)
            )

            self.learn(
                subject,
                statement,
                memory_type="FACT",
                confidence=confidence,
            )

            self._learned_research_keys.add(key)
            learned_any = True

        return learned_any

    def research(self, query_or_request: Any):
        if self.research_engine is None:
            raise RuntimeError(
                "ResearchEngine is not configured for this Intelligence instance."
            )

        from .research.models import ResearchRequest

        if isinstance(query_or_request, ResearchRequest):
            request = query_or_request
        else:
            request = ResearchRequest(
                query=str(query_or_request or '').strip()
            )

        return self.research_engine.research(request)

    def continuous_learn(self, query_or_request: Any):
        """
        Research an unknown topic and allow the configured research
        pipeline to validate and persist new knowledge.

        The existing research() API remains unchanged. This method
        represents the explicit continuous-learning entry point.
        """
        if self.research_engine is None:
            raise RuntimeError(
                "ResearchEngine is not configured for this Intelligence instance."
            )

        return self.research(query_or_request)

    def reason(self, context: Dict[str, Any]) -> Dict[str, Any]:
        return self.coordinator.reason(context)

    def understand(self, text: str) -> Dict[str, Any]:
        return self.pipeline.process(text)

    def load_knowledge(self, root: str = "knowledge/quavron") -> int:
        """
        Load official Quavron documentation only.

        This reads the knowledge directory and never scans
        Quavron application source code.
        """

        builder = KnowledgeBuilder(root)
        parser = KnowledgeParser()

        documents = builder.build()
        items = parser.parse_many(documents)

        self.knowledge_repository.clear()

        return self.knowledge_repository.add_many(items)

    def _knowledge_lookup(self, text: str) -> Any:
        """
        Retrieve information from user memory first, then from the
        official Quavron knowledge repository.

        Supports exact learned subjects, normalized multi-word subjects,
        and compound subjects such as ``quantum.entanglement``.
        """
        text = str(text or "").strip()

        if not text:
            return None

        words = (
            text
            .replace("؟", " ")
            .replace("?", " ")
            .replace("،", " ")
            .replace(",", " ")
            .split()
        )

        cleaned_words = [
            word.strip("،,.!؟?:؛").strip()
            for word in words
            if word.strip("،,.!؟?:؛").strip()
        ]

        # 1. Try the exact input first.
        value = self.recall(text)
        if value is not None:
            return value

        # 2. Try the normalized question.
        normalized = " ".join(cleaned_words).strip()

        if normalized and normalized != text:
            value = self.recall(normalized)
            if value is not None:
                return value

        # 3. Try a compound subject.
        #
        # Example:
        # "What is quantum entanglement?"
        # -> "quantum.entanglement"
        stop_words = {
            "ما", "ماذا", "من", "هل", "هو", "هي",
            "هذا", "هذه", "عن", "في", "منصة",
            "what", "is", "the", "a", "an", "about",
        }

        candidates = []

        for word in cleaned_words:
            lowered = word.lower()

            if lowered in stop_words:
                continue

            if len(lowered) < 2:
                continue

            candidates.append(lowered)

        if candidates:
            compound = ".".join(candidates)

            value = self.recall(compound)
            if value is not None:
                return value

        # 4. Try individual learned subjects.
        # This preserves direct memory lookup for questions such as:
        # "ما هي Quavron؟" -> recall("Quavron")
        for candidate in candidates:
            value = self.recall(candidate)
            if value is not None:
                return value

            # Preserve original casing for coordinators whose memory
            # implementation uses case-sensitive subjects.
            for original in cleaned_words:
                if original.lower() == candidate:
                    value = self.recall(original)
                    if value is not None:
                        return value

        # 5. Search the official knowledge repository.
        results = self.knowledge_repository.search(
            text,
            limit=5,
        )

        if results:
            best = results[0]["item"]
            return best.get("value")

        # 6. Search meaningful individual terms.
        for candidate in candidates:
            results = self.knowledge_repository.search(
                candidate,
                limit=5,
            )

            if results:
                best = results[0]["item"]
                return best.get("value")

        return None

    def _should_research(self, text: str) -> bool:
        """
        Decide whether a question requires external/local research.

        Research is required only when the current knowledge lookup
        cannot provide a known answer.
        """
        text = str(text or "").strip()

        if not text:
            return False

        known = self._knowledge_lookup(text)

        return known is None

    def _auto_research(self, text: str):
        """
        Run research for an unknown question and synchronize the result
        with the shared knowledge repository and continuous learning.

        Once validated knowledge is stored, subsequent requests can be
        answered locally without repeating the research operation.
        """
        text = str(text or "").strip()

        if not text:
            return None

        if not self._should_research(text):
            return None

        if self.research_engine is None:
            return None

        result = self.research(text)

        if result is None or not getattr(result, "success", False):
            return result

        knowledge = getattr(result, "knowledge", None) or []

        if knowledge:
            from .knowledge.research_adapter import (
                ResearchKnowledgeAdapter,
            )

            adapter = ResearchKnowledgeAdapter()

            for item in knowledge:
                adapted = adapter.adapt(item)
                self.knowledge_repository.add_research(adapted)

        self._learn_research_result(result)

        return result

    def _reasoning_context(self, text: str) -> Dict[str, Any]:
        """
        Build a lightweight reasoning context from the request.
        """

        lowered = str(text or "").lower()

        context: Dict[str, Any] = {
            "input": text,
        }

        if "quavron" in lowered:
            context["subject"] = "Quavron"

        if "منصة" in lowered or "platform" in lowered:
            context["type"] = "platform"

        if "qai" in lowered:
            context["subject"] = "QAI"

        return context

    def respond(self, text: str) -> Dict[str, Any]:

        understood = self.understand(text)

        intent = understood["intent"]

        pipeline_result = dict(understood)

        if intent == "knowledge":
            knowledge = self._knowledge_lookup(text)

            if knowledge is not None:
                pipeline_result["knowledge"] = knowledge
            else:
                # Unknown knowledge questions may trigger local research.
                # Research remains optional when no ResearchEngine exists.
                research_result = self._auto_research(text)

                if research_result is not None:
                    pipeline_result["research"] = research_result
                    pipeline_result["knowledge"] = (
                        research_result.summary
                        if getattr(research_result, "summary", None)
                        else None
                    )
                else:
                    pipeline_result["knowledge"] = None

        elif intent == "reasoning":
            context = self._reasoning_context(text)

            pipeline_result["reasoning"] = self.reason(context)

        return self.response.build(
            pipeline_result
        )

    def process(self, text: str) -> Dict[str, Any]:

        understood = self.understand(text)
        response = self.respond(text)

        return {
            "success": True,
            "input": text,
            "intent": understood["intent"],
            "confidence": understood["confidence"],
            "route": understood["route"],
            "response": response,
        }

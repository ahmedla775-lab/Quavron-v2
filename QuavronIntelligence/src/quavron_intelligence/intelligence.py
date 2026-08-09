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

        self.knowledge_repository = KnowledgeRepository()

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
        Retrieve information from the official Quavron knowledge
        repository using the meaningful terms in the question.

        User memory is checked first. Official documentation is
        then searched locally. No application source code is read.
        """

        text = str(text or "").strip()

        # 1. Explicit memory has priority.
        words = (
            text
            .replace("؟", " ")
            .replace("?", " ")
            .replace("،", " ")
            .replace(",", " ")
            .split()
        )

        for word in words:
            cleaned = word.strip("،,.!؟?:؛")

            if not cleaned:
                continue

            value = self.recall(cleaned)

            if value is not None:
                return value

        # 2. Search the official knowledge repository.
        results = self.knowledge_repository.search(
            text,
            limit=5,
        )

        if results:
            best = results[0]["item"]
            return best.get("value")

        # 3. Search meaningful individual terms.
        stop_words = {
            "ما",
            "ماذا",
            "من",
            "هل",
            "هو",
            "هي",
            "هذا",
            "هذه",
            "عن",
            "في",
            "منصة",
            "هي؟",
            "هو؟",
            "what",
            "is",
            "the",
            "a",
            "an",
            "about",
        }

        candidates = []

        for word in words:
            cleaned = word.strip("،,.!؟?:؛").lower()

            if not cleaned:
                continue

            if cleaned in stop_words:
                continue

            if len(cleaned) < 2:
                continue

            candidates.append(cleaned)

        # Search the most meaningful terms first.
        for candidate in candidates:
            results = self.knowledge_repository.search(
                candidate,
                limit=5,
            )

            if results:
                best = results[0]["item"]
                return best.get("value")

        return None

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
            pipeline_result["knowledge"] = self._knowledge_lookup(text)

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

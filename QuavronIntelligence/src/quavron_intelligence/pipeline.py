from __future__ import annotations

from typing import Any, Dict

from .intent import IntentEngine
from .coordinator import IntelligenceCoordinator


class IntelligencePipeline:
    """
    Main local processing pipeline.

    Determines intent first, then routes the request
    to the appropriate intelligence operation.
    """

    def __init__(
        self,
        coordinator: IntelligenceCoordinator,
        intent_engine: IntentEngine | None = None,
    ):
        if coordinator is None:
            raise ValueError("coordinator cannot be None")

        self.coordinator = coordinator
        self.intent = intent_engine or IntentEngine()

    def process(self, text: str) -> Dict[str, Any]:
        text = str(text or "").strip()

        detected = self.intent.detect(text)

        result: Dict[str, Any] = {
            "success": True,
            "input": text,
            "intent": detected.intent,
            "confidence": detected.confidence,
            "metadata": detected.metadata,
        }

        if detected.intent == "knowledge":
            result["route"] = "knowledge"
            result["action"] = "recall"

        elif detected.intent == "reasoning":
            result["route"] = "reasoning"
            result["action"] = "reason"

        elif detected.intent == "learn":
            result["route"] = "memory"
            result["action"] = "learn"

        elif detected.intent == "help":
            result["route"] = "assistant"
            result["action"] = "help"

        elif detected.intent == "greeting":
            result["route"] = "conversation"
            result["action"] = "greeting"

        else:
            result["route"] = "unknown"
            result["action"] = "unknown"

        return result

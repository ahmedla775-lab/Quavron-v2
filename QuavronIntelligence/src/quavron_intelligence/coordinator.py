from __future__ import annotations

from typing import Any, Dict


class IntelligenceCoordinator:
    """
    Coordinates knowledge, reasoning, and memory operations.

    This layer does not replace the existing intelligence cores.
    It provides one stable interface for higher-level systems such as QAI.
    """

    def __init__(self, engine):
        if engine is None:
            raise ValueError("engine cannot be None")

        self.engine = engine

    def learn(
        self,
        subject: str,
        value: Any,
        memory_type: str = "FACT",
        confidence: float = 1.0,
    ) -> Dict[str, Any]:
        self.engine.learn(subject, value)

        return {
            "success": True,
            "subject": subject,
            "value": value,
            "memory_type": memory_type,
            "confidence": float(confidence),
        }

    def recall(self, subject: str) -> Any:
        return self.engine.recall(subject)

    def reason(self, context: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(context, dict):
            raise TypeError("context must be a dictionary")

        return self.engine.reason(context)

    def process(
        self,
        subject: str | None = None,
        context: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        result: Dict[str, Any] = {
            "success": True,
            "knowledge": None,
            "reasoning": None,
        }

        if subject is not None:
            result["knowledge"] = self.recall(subject)

        if context is not None:
            result["reasoning"] = self.reason(context)

        return result

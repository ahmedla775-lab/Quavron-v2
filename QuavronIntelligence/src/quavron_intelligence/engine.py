from __future__ import annotations

from typing import Any, Dict


class IntelligenceEngine:
    """
    Core intelligence engine.

    This first version provides a stable foundation
    for reasoning, rules, knowledge and decision systems.
    """

    VERSION = "0.1.0"

    def __init__(self):
        self.knowledge: Dict[str, Any] = {}
        self.rules = []

    def learn(self, key: str, value: Any) -> Dict[str, Any]:
        key = str(key).strip()

        if not key:
            raise ValueError("key cannot be empty")

        self.knowledge[key] = value

        return {
            "success": True,
            "key": key,
            "value": value,
        }

    def recall(self, key: str) -> Any:
        return self.knowledge.get(str(key).strip())

    def add_rule(self, condition, action) -> Dict[str, Any]:
        if not callable(condition):
            raise TypeError("condition must be callable")

        if not callable(action):
            raise TypeError("action must be callable")

        self.rules.append(
            {
                "condition": condition,
                "action": action,
            }
        )

        return {
            "success": True,
            "rules": len(self.rules),
        }

    def reason(self, context: Dict[str, Any]) -> Dict[str, Any]:
        results = []

        for rule in self.rules:
            if rule["condition"](context):
                results.append(
                    rule["action"](context)
                )

        return {
            "success": True,
            "results": results,
            "rules_evaluated": len(self.rules),
        }

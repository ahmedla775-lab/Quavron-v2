from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Dict, List


@dataclass(frozen=True)
class Fact:
    subject: str
    predicate: str
    value: Any


@dataclass
class Rule:
    name: str
    condition: Callable[[Dict[str, Any]], bool]
    conclusion: Callable[[Dict[str, Any]], Fact | None]


class InferenceEngine:
    """
    Lightweight rule-based inference engine.

    Converts known facts into new conclusions
    without external AI services.
    """

    def __init__(self):
        self._facts: List[Fact] = []
        self._rules: List[Rule] = []

    def add_fact(
        self,
        subject: str,
        predicate: str,
        value: Any,
    ) -> Fact:
        fact = Fact(
            subject=str(subject),
            predicate=str(predicate),
            value=value,
        )

        if fact not in self._facts:
            self._facts.append(fact)

        return fact

    def add_rule(
        self,
        name: str,
        condition: Callable[[Dict[str, Any]], bool],
        conclusion: Callable[[Dict[str, Any]], Fact | None],
    ) -> Rule:
        rule = Rule(
            name=str(name),
            condition=condition,
            conclusion=conclusion,
        )

        self._rules.append(rule)
        return rule

    def facts(self) -> List[Fact]:
        return list(self._facts)

    def infer(
        self,
        context: Dict[str, Any] | None = None,
        max_rounds: int = 10,
    ) -> Dict[str, Any]:
        context = dict(context or {})

        derived: List[Fact] = []
        rules_evaluated = 0

        for _ in range(max(1, int(max_rounds))):
            changed = False

            for rule in self._rules:
                rules_evaluated += 1

                try:
                    matched = rule.condition(context)
                except Exception:
                    matched = False

                if not matched:
                    continue

                try:
                    fact = rule.conclusion(context)
                except Exception:
                    fact = None

                if fact is None:
                    continue

                if fact not in self._facts:
                    self._facts.append(fact)
                    derived.append(fact)
                    changed = True

                    context[fact.predicate] = fact.value

            if not changed:
                break

        return {
            "success": True,
            "facts": derived,
            "rules_evaluated": rules_evaluated,
        }

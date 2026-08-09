from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class KnowledgeFact:
    subject: str
    predicate: str
    value: Any
    confidence: float = 1.0
    source: str = "local"
    metadata: Dict[str, Any] = field(default_factory=dict)


class KnowledgeCore:
    """
    Lightweight local knowledge system.

    Stores structured facts without external databases
    or external AI services.
    """

    def __init__(self):
        self._facts: List[KnowledgeFact] = []

    def add_fact(
        self,
        subject: str,
        predicate: str,
        value: Any,
        confidence: float = 1.0,
        source: str = "local",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> KnowledgeFact:

        subject = str(subject).strip()
        predicate = str(predicate).strip()

        if not subject:
            raise ValueError("subject cannot be empty")

        if not predicate:
            raise ValueError("predicate cannot be empty")

        confidence = max(0.0, min(1.0, float(confidence)))

        fact = KnowledgeFact(
            subject=subject,
            predicate=predicate,
            value=value,
            confidence=confidence,
            source=source,
            metadata=dict(metadata or {}),
        )

        self._facts.append(fact)

        return fact

    def find(
        self,
        subject: Optional[str] = None,
        predicate: Optional[str] = None,
    ) -> List[KnowledgeFact]:

        results = self._facts

        if subject is not None:
            subject = str(subject).strip().lower()
            results = [
                fact
                for fact in results
                if fact.subject.lower() == subject
            ]

        if predicate is not None:
            predicate = str(predicate).strip().lower()
            results = [
                fact
                for fact in results
                if fact.predicate.lower() == predicate
            ]

        return list(results)

    def count(self) -> int:
        return len(self._facts)

    def clear(self) -> None:
        self._facts.clear()

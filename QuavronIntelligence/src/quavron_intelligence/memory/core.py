from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class Memory:
    key: str
    value: Any
    memory_type: str = "fact"
    confidence: float = 1.0
    source: str = "local"
    metadata: Dict[str, Any] = field(default_factory=dict)


class MemoryCore:
    """
    Local memory layer for Quavron Intelligence.

    Keeps persistent-style knowledge separate from
    temporary reasoning context.
    """

    VALID_TYPES = {
        "fact",
        "concept",
        "preference",
        "context",
        "inference",
    }

    def __init__(self):
        self._memories: Dict[str, Memory] = {}

    def remember(
        self,
        key: str,
        value: Any,
        memory_type: str = "fact",
        confidence: float = 1.0,
        source: str = "local",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Memory:

        key = str(key).strip()
        memory_type = str(memory_type).strip().lower()

        if not key:
            raise ValueError("memory key cannot be empty")

        if memory_type not in self.VALID_TYPES:
            raise ValueError(
                f"unsupported memory_type: {memory_type}"
            )

        confidence = max(0.0, min(1.0, float(confidence)))

        memory = Memory(
            key=key,
            value=value,
            memory_type=memory_type,
            confidence=confidence,
            source=source,
            metadata=dict(metadata or {}),
        )

        self._memories[key] = memory

        return memory

    def recall(self, key: str) -> Optional[Memory]:
        return self._memories.get(str(key).strip())

    def forget(self, key: str) -> bool:
        key = str(key).strip()

        if key not in self._memories:
            return False

        del self._memories[key]
        return True

    def find(
        self,
        memory_type: Optional[str] = None,
    ) -> List[Memory]:

        memories = list(self._memories.values())

        if memory_type is not None:
            memory_type = str(memory_type).strip().lower()

            memories = [
                memory
                for memory in memories
                if memory.memory_type == memory_type
            ]

        return memories

    def count(self) -> int:
        return len(self._memories)

    def clear(self) -> None:
        self._memories.clear()

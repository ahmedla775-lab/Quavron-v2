from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class IndexEntry:
    key: str
    data: Any
    metadata: Dict[str, Any] = field(default_factory=dict)


class DataIndex:
    """
    Lightweight in-memory index for QuavronData.

    This component is intentionally independent from databases,
    external APIs, and QAI.
    """

    def __init__(self):
        self._entries: Dict[str, IndexEntry] = {}

    def add(
        self,
        key: str,
        data: Any,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> IndexEntry:
        key = str(key).strip()

        if not key:
            raise ValueError("Index key cannot be empty")

        entry = IndexEntry(
            key=key,
            data=data,
            metadata=dict(metadata or {}),
        )

        self._entries[key] = entry
        return entry

    def get(self, key: str) -> Optional[IndexEntry]:
        return self._entries.get(str(key).strip())

    def exists(self, key: str) -> bool:
        return str(key).strip() in self._entries

    def remove(self, key: str) -> bool:
        key = str(key).strip()

        if key not in self._entries:
            return False

        del self._entries[key]
        return True

    def search(self, query: str) -> List[IndexEntry]:
        query = str(query or "").strip().lower()

        if not query:
            return []

        results = []

        for entry in self._entries.values():
            key_match = query in entry.key.lower()

            data_text = str(entry.data).lower()
            data_match = query in data_text

            metadata_text = str(entry.metadata).lower()
            metadata_match = query in metadata_text

            if key_match or data_match or metadata_match:
                results.append(entry)

        return results

    def all(self) -> List[IndexEntry]:
        return list(self._entries.values())

    def clear(self) -> None:
        self._entries.clear()

    def count(self) -> int:
        return len(self._entries)

    def stats(self) -> Dict[str, Any]:
        return {
            "entries": len(self._entries),
            "engine": "Quavron Data Index",
            "version": "0.1.0",
        }

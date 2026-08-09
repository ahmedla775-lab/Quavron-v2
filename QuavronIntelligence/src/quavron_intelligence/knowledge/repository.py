from __future__ import annotations

import re
from typing import Any, Dict, Iterable, List


class KnowledgeRepository:
    """
    Local repository for official Quavron knowledge.

    The repository stores structured knowledge extracted from
    official documentation only.

    It never reads application source code.
    """

    def __init__(self):
        self._items: List[Dict[str, Any]] = []

    def add(self, item: Any) -> None:
        if item is None:
            return

        if hasattr(item, "__dataclass_fields__"):
            item = {
                field: getattr(item, field)
                for field in item.__dataclass_fields__
            }

        if not isinstance(item, dict):
            return

        key = str(item.get("key", "")).strip()

        if not key:
            return

        self._items.append(dict(item))

    def add_research(self, item: Any) -> bool:
        """
        Add one already-validated research knowledge item.

        Research validation must happen before this method is called.
        The repository stores the item as research-derived knowledge.
        """
        if item is None:
            return False

        if hasattr(item, "__dataclass_fields__"):
            item = {
                field: getattr(item, field)
                for field in item.__dataclass_fields__
            }

        if not isinstance(item, dict):
            return False

        if not item.get("research"):
            metadata = item.get("metadata") or {}

            if not metadata.get("research"):
                return False

        key = str(item.get("key", "")).strip()

        if not key:
            return False

        # Research knowledge is immutable-by-key inside the repository.
        # The same research fact must not be stored more than once.
        for existing in self._items:
            if str(existing.get("key", "")).strip() == key:
                existing_metadata = existing.get("metadata") or {}

                if (
                    existing.get("source") == "research"
                    or existing.get("research")
                    or existing_metadata.get("research")
                ):
                    return False

        self._items.append(dict(item))
        return True

    def add_many(self, items: Iterable[Any]) -> int:
        count = 0

        for item in items:
            before = len(self._items)
            self.add(item)

            if len(self._items) > before:
                count += 1

        return count

    def all(self) -> List[Dict[str, Any]]:
        return [dict(item) for item in self._items]

    def count(self) -> int:
        return len(self._items)

    def clear(self) -> None:
        self._items.clear()

    @staticmethod
    def _tokens(value: Any) -> List[str]:
        text = str(value or "").lower()

        return re.findall(
            r"[a-z0-9_]+|[\u0600-\u06ff]+",
            text,
        )

    def search(
        self,
        query: str,
        limit: int = 5,
    ) -> List[Dict[str, Any]]:
        query = str(query or "").strip()

        if not query:
            return []

        query_tokens = set(self._tokens(query))

        if not query_tokens:
            return []

        results = []

        for item in self._items:
            searchable = " ".join(
                str(item.get(field, ""))
                for field in (
                    "key",
                    "item_type",
                    "type",
                    "value",
                    "question",
                    "answer",
                    "content",
                    "category",
                    "source",
                )
            )

            tokens = set(self._tokens(searchable))
            matched = query_tokens.intersection(tokens)

            if not matched:
                continue

            score = float(len(matched))

            key = str(item.get("key", "")).lower()
            value = str(item.get("value", "")).lower()

            query_lower = query.lower()

            if query_lower in key:
                score += 6.0

            if query_lower in value:
                score += 5.0

            metadata = item.get("metadata") or {}

            question = str(metadata.get("question", "")).lower()
            name = str(metadata.get("name", "")).lower()

            if query_lower in question:
                score += 5.0

            if query_lower in name:
                score += 4.0

            results.append(
                {
                    "score": score,
                    "item": dict(item),
                }
            )

        results.sort(
            key=lambda result: (
                -result["score"],
                result["item"].get("key", ""),
            )
        )

        return results[: max(0, int(limit))]

    def find(self, query: str) -> Dict[str, Any] | None:
        results = self.search(query, limit=1)

        if not results:
            return None

        return results[0]["item"]

from __future__ import annotations

from typing import Any, Dict, Iterable

from .engine import DataEngine
from .search import DataSearch
from .index import DataIndex


class QuavronData:
    """
    Public facade for the Quavron Data Engine.

    Provides a stable entry point for Quavron applications
    without exposing internal implementation details.
    """

    VERSION = "0.1.0"

    def __init__(self):
        self.engine = DataEngine()
        self.index = DataIndex()
        self.search = DataSearch()

    def process(self, data: Dict[str, Any]):
        return self.engine.process(data)

    def add(
        self,
        record_id: str,
        data: Dict[str, Any],
        fields: Iterable[str] | None = None,
    ):
        return self.search.add(
            record_id,
            data,
            fields=fields,
        )

    def find(
        self,
        query: str,
        fields: Iterable[str] | None = None,
        limit: int = 10,
    ):
        return self.search.search(
            query,
            fields=fields,
            limit=limit,
        )

    def get(self, record_id: str):
        return self.search.get(record_id)

    def remove(self, record_id: str) -> bool:
        return self.search.remove(record_id)

    def count(self) -> int:
        return self.search.count()

    def clear(self) -> None:
        self.search.clear()

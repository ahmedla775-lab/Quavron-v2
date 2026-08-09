from __future__ import annotations

from typing import Any, Dict, Iterable, List

from .indexer import DataIndexer


class SearchResult(dict):
    """
    Backward-compatible search result.

    Behaves like a dictionary while also providing
    attribute-style access to common result fields.
    """

    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError as exc:
            raise AttributeError(name) from exc



class DataSearch:
    """
    Search layer built on top of DataIndexer.

    Provides ranked local search without external
    databases or external APIs.
    """

    def __init__(self, indexer: DataIndexer | None = None):
        self.indexer = indexer or DataIndexer()

    def search(
        self,
        query: str,
        fields: Iterable[str] | None = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        query = str(query or "").strip()

        if not query:
            return []

        tokens = self._tokens(query)

        if not tokens:
            return []

        indexed_fields = (
            list(fields)
            if fields is not None
            else list(self.indexer._indexes.keys())
        )

        results: Dict[str, Dict[str, Any]] = {}

        for field in indexed_fields:
            field_index = self.indexer._indexes.get(field, {})

            for token in tokens:
                record_ids = field_index.get(token, set())

                for record_id in record_ids:
                    record = self.indexer.get(record_id)

                    if record is None:
                        continue

                    entry = results.setdefault(
                        record_id,
                        {
                            "id": record_id,
                            "score": 0.0,
                            "data": record,
                            "matched_fields": [],
                        },
                    )

                    weight = self._field_weight(field)

                    entry["score"] += weight

                    if field not in entry["matched_fields"]:
                        entry["matched_fields"].append(field)

        ranked = sorted(
            results.values(),
            key=lambda item: (
                -item["score"],
                item["id"],
            ),
        )

        return ranked[: max(0, int(limit))]

    def add(
        self,
        record_id: str,
        data: Dict[str, Any],
        fields: Iterable[str] | None = None,
    ) -> Dict[str, Any]:
        return self.indexer.add(
            record_id,
            data,
            fields=fields,
        )

    def add_many(
        self,
        records: Iterable[Dict[str, Any]],
        id_field: str = "id",
        fields: Iterable[str] | None = None,
    ) -> Dict[str, Any]:
        return self.indexer.add_many(
            records,
            id_field=id_field,
            fields=fields,
        )

    def get(self, record_id: str) -> Dict[str, Any] | None:
        return self.indexer.get(record_id)

    def remove(self, record_id: str) -> bool:
        return self.indexer.remove(record_id)

    def clear(self) -> None:
        self.indexer.clear()

    def count(self) -> int:
        return self.indexer.count()

    @staticmethod
    def _field_weight(field: str) -> float:
        field = str(field).strip().lower()

        if field in {
            "name",
            "title",
            "question",
            "key",
            "id",
        }:
            return 10.0

        if field in {
            "description",
            "text",
            "content",
            "answer",
        }:
            return 3.0

        return 1.0

    @staticmethod
    def _tokens(value: Any) -> set[str]:
        if value is None:
            return set()

        text = str(value).strip().lower()

        if not text:
            return set()

        return {
            token
            for token in text.split()
            if token
        }

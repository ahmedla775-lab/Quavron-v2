from __future__ import annotations

from collections import defaultdict
from typing import Any, Dict, Iterable, List


class DataIndexer:
    """
    Lightweight in-memory indexing engine.

    Builds searchable indexes over arbitrary records without
    introducing external database dependencies.
    """

    def __init__(self):
        self._records: Dict[str, Dict[str, Any]] = {}
        self._indexes: Dict[str, Dict[str, set[str]]] = defaultdict(
            lambda: defaultdict(set)
        )

    def add(
        self,
        record_id: str,
        data: Dict[str, Any],
        fields: Iterable[str] | None = None,
    ) -> Dict[str, Any]:
        record_id = str(record_id).strip()

        if not record_id:
            raise ValueError("record_id cannot be empty")

        if not isinstance(data, dict):
            raise TypeError("data must be a dictionary")

        self.remove(record_id)

        stored = dict(data)
        self._records[record_id] = stored

        fields_to_index = list(fields) if fields is not None else stored.keys()

        for field in fields_to_index:
            if field not in stored:
                continue

            value = stored[field]

            for token in self._tokens(value):
                self._indexes[field][token].add(record_id)

        return {
            "success": True,
            "record_id": record_id,
            "indexed_fields": list(fields_to_index),
        }

    def add_many(
        self,
        records: Iterable[Dict[str, Any]],
        id_field: str = "id",
        fields: Iterable[str] | None = None,
    ) -> Dict[str, Any]:
        count = 0

        for record in records:
            if not isinstance(record, dict):
                continue

            if id_field not in record:
                continue

            self.add(
                str(record[id_field]),
                record,
                fields=fields,
            )
            count += 1

        return {
            "success": True,
            "count": count,
        }

    def remove(self, record_id: str) -> bool:
        record_id = str(record_id).strip()

        if record_id not in self._records:
            return False

        record = self._records.pop(record_id)

        for field, value in record.items():
            for token in self._tokens(value):
                bucket = self._indexes[field].get(token)

                if bucket is None:
                    continue

                bucket.discard(record_id)

                if not bucket:
                    del self._indexes[field][token]

        return True

    def search(
        self,
        query: str,
        fields: Iterable[str] | None = None,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        tokens = self._tokens(query)

        if not tokens:
            return []

        allowed_fields = set(fields) if fields is not None else set(self._indexes)

        scores: Dict[str, float] = defaultdict(float)

        for field in allowed_fields:
            field_index = self._indexes.get(field, {})

            for token in tokens:
                for record_id in field_index.get(token, set()):
                    scores[record_id] += 1.0

        ranked = sorted(
            scores.items(),
            key=lambda item: (-item[1], item[0]),
        )

        results = []

        for record_id, score in ranked[: max(0, int(limit))]:
            results.append(
                {
                    "id": record_id,
                    "score": score,
                    "data": dict(self._records[record_id]),
                }
            )

        return results

    def get(self, record_id: str) -> Dict[str, Any] | None:
        record = self._records.get(str(record_id).strip())

        if record is None:
            return None

        return dict(record)

    def clear(self) -> None:
        self._records.clear()
        self._indexes.clear()

    def count(self) -> int:
        return len(self._records)

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

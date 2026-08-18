from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List


class KnowledgeStore:
    """
    مخزن المعرفة المستخلصة من المادة الخام.

    مهم:
    - لا يحذف RAW.
    - لا يستبدل research.jsonl.
    - يخزن المعرفة المستخلصة بشكل مستقل.
    - يحتفظ raw_id للرجوع إلى المصدر الأصلي.
    """

    name = "knowledge"

    def __init__(self, root: str = "qai_research/data"):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

        self.knowledge_file = self.root / "knowledge.jsonl"

        self._lock = Lock()

    def save(self, knowledge: Any) -> bool:
        payload = self._serialize(knowledge)

        # ---------------------------------------------------------
        # KNOWLEDGE PERSISTENCE GATE
        # ---------------------------------------------------------
        # RAW يبقى محفوظًا بشكل مستقل.
        # هذا الـ Store يخزن فقط المعرفة التي أصبحت جاهزة.
        #
        # duplicate        -> لا تخزن
        # knowledge_ready  -> يجب أن تكون True
        # noise            -> لا تخزن
        #
        # Relevance ليست سلطة معرفية هنا.
        # القرار النهائي لدخول knowledge store يعتمد على
        # classification/processing وليس على relevance وحدها.

        if payload.get("duplicate") is True:
            return False

        if payload.get("knowledge_ready") is not True:
            return False

        if payload.get("status") == "noise":
            return False

        return self._append(payload)

    def save_many(self, items: List[Any]) -> int:
        saved = 0

        for item in items:
            if self.save(item):
                saved += 1

        return saved

    def list(self, limit: int = 100) -> List[Dict[str, Any]]:
        if not self.knowledge_file.exists():
            return []

        limit = max(0, int(limit))

        if limit == 0:
            return []

        records = []

        try:
            with self.knowledge_file.open(
                "r",
                encoding="utf-8",
            ) as handle:

                for line in handle:
                    line = line.strip()

                    if not line:
                        continue

                    try:
                        records.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue

                    if len(records) >= limit:
                        break

        except OSError:
            return []

        return records

    def count(self) -> int:
        if not self.knowledge_file.exists():
            return 0

        count = 0

        try:
            with self.knowledge_file.open(
                "r",
                encoding="utf-8",
            ) as handle:

                for line in handle:
                    if line.strip():
                        count += 1

        except OSError:
            return 0

        return count

    @staticmethod
    def _serialize(value: Any) -> Dict[str, Any]:

        if hasattr(value, "__dataclass_fields__"):
            from dataclasses import asdict
            return asdict(value)

        if isinstance(value, dict):
            return value

        raise TypeError(
            f"Unsupported knowledge type: {type(value).__name__}"
        )

    def _append(self, payload: Dict[str, Any]) -> bool:

        try:
            with self._lock:

                with self.knowledge_file.open(
                    "a",
                    encoding="utf-8",
                ) as handle:

                    handle.write(
                        json.dumps(
                            payload,
                            ensure_ascii=False,
                        )
                    )

                    handle.write("\n")

            return True

        except OSError:
            return False

    def health(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "root": str(self.root),
            "knowledge_file": str(self.knowledge_file),
            "exists": self.knowledge_file.exists(),
            "count": self.count(),
        }

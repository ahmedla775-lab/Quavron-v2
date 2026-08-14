from __future__ import annotations

from typing import Any, Iterable, List

from .knowledge_store import KnowledgeStore


class KnowledgeIngestor:
    """
    يستقبل المعرفة المستخلصة ويخزنها.

    لا يقوم بالاستخلاص بنفسه.
    لا يقوم بالإجابة.
    لا يحذف المادة الخام.
    """

    def __init__(self, store: KnowledgeStore | None = None):
        self.store = store or KnowledgeStore()

    def ingest(self, knowledge: Any) -> bool:
        return self.store.save(knowledge)

    def ingest_many(self, knowledge_items: Iterable[Any]) -> int:

        saved = 0

        for item in knowledge_items:
            if self.ingest(item):
                saved += 1

        return saved

    def health(self):
        return self.store.health()

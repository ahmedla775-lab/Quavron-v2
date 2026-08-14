from qai_research.ingestion.raw_store import RawKnowledgeStore


class RawIngestor:
    """
    يحول نتائج البحث الخام إلى مادة معرفة قابلة للمعالجة.

    مهم:
    لا يستعمل RelevanceFilter هنا.
    """

    def __init__(self, store=None):
        self.store = store or RawKnowledgeStore()

    def ingest(self, query, results):
        results = list(results or [])

        documents = self.store.save_results(
            query,
            results,
        )

        return {
            "query": query,
            "received": len(results),
            "stored": len(documents),
            "documents": documents,
        }

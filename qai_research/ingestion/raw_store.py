import json
import hashlib
from pathlib import Path
from datetime import datetime, timezone


class RawKnowledgeStore:
    """
    تخزين المادة الخام للبحث دون تطبيق RelevanceFilter عليها.

    القاعدة:
    - لا نحذف النتائج الضعيفة.
    - لا نحذف النتائج المبعثرة.
    - لا نحاول اعتبارها حقائق موثوقة هنا.
    - كل نتيجة تحتفظ بمصدرها وسياقها.
    """

    def __init__(self, path=None):
        self.path = Path(
            path or "qai_research/data/raw_knowledge.jsonl"
        )
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _document_id(query, result):
        raw = "|".join([
            str(query or ""),
            str(getattr(result, "url", "") or ""),
            str(getattr(result, "title", "") or ""),
            str(getattr(result, "snippet", "") or ""),
        ])

        return hashlib.sha256(
            raw.encode("utf-8", errors="ignore")
        ).hexdigest()

    @staticmethod
    def _serialize_result(query, result):
        metadata = getattr(result, "metadata", {}) or {}

        return {
            "document_id": RawKnowledgeStore._document_id(
                query,
                result,
            ),
            "query": query,
            "collected_at": datetime.now(
                timezone.utc
            ).isoformat(),

            "title": getattr(result, "title", "") or "",
            "url": getattr(result, "url", "") or "",
            "snippet": getattr(result, "snippet", "") or "",
            "content": getattr(result, "content", "") or "",
            "source_type": (
                metadata.get("source_type")
                or (
                    "document"
                    if metadata.get("raw_origin") == "research.documents"
                    else "search_result"
                )
            ),

            "source_engine": (
                getattr(result, "source_engine", "")
                or metadata.get("source_engine", "")
                or metadata.get("engine", "")
            ),

            "score": float(
                getattr(result, "score", 0.0) or 0.0
            ),

            "relevance": float(
                getattr(result, "relevance", 0.0) or 0.0
            ),

            "rank": int(
                getattr(result, "rank", 0) or 0
            ),

            "metadata": metadata,
        }

    def save_result(self, query, result):
        document = self._serialize_result(query, result)

        with self.path.open(
            "a",
            encoding="utf-8",
        ) as f:
            f.write(
                json.dumps(
                    document,
                    ensure_ascii=False,
                )
                + "\n"
            )

        return document

    def save_results(self, query, results):
        saved = []

        for result in results:
            saved.append(
                self.save_result(
                    query,
                    result,
                )
            )

        return saved

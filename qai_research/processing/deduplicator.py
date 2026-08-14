from __future__ import annotations

import hashlib
from dataclasses import asdict, is_dataclass
from typing import Any, Dict, Optional, Set


class KnowledgeDeduplicator:
    """
    إزالة التكرار من المعرفة المعالجة.

    قواعد الهوية:
    1. نفس URL = نفس المصدر.
    2. نفس المحتوى = نفس المعرفة.
    3. SearchResult لا يكرر Document كامل من نفس URL.
    """

    @staticmethod
    def _get(
        document: Any,
        key: str,
        default: Any = "",
    ) -> Any:
        if isinstance(document, dict):
            return document.get(key, default)

        return getattr(document, key, default)

    @staticmethod
    def _metadata(document: Any) -> Dict[str, Any]:
        metadata = KnowledgeDeduplicator._get(
            document,
            "metadata",
            {},
        )

        return dict(metadata) if isinstance(metadata, dict) else {}

    @classmethod
    def _url_key(cls, document: Any) -> str:
        url = str(
            cls._get(document, "url", "") or ""
        ).strip().lower()

        return url.rstrip("/")

    @classmethod
    def _content_key(cls, document: Any) -> str:
        title = str(
            cls._get(document, "title", "") or ""
        ).strip().lower()

        text = str(
            cls._get(document, "text", "")
            or cls._get(document, "content", "")
            or cls._get(document, "snippet", "")
            or ""
        ).strip().lower()

        payload = f"{title}\n{text}"

        return hashlib.sha256(
            payload.encode("utf-8", errors="ignore")
        ).hexdigest()

    @classmethod
    def fingerprint(cls, document: Any) -> str:
        """
        fingerprint ثابت للمحتوى.

        لا نعتمد على URL وحده لأن نفس المعرفة قد تظهر
        في أكثر من صفحة.
        """

        return cls._content_key(document)

    @classmethod
    def _identity_keys(cls, document: Any):
        url_key = cls._url_key(document)
        content_key = cls._content_key(document)

        keys = []

        if url_key:
            keys.append(f"url:{url_key}")

        if content_key:
            keys.append(f"content:{content_key}")

        return keys

    @classmethod
    def _priority(cls, document: Any) -> int:
        """
        الوثيقة الكاملة أعلى أولوية من search_result.
        """

        source_type = str(
            cls._get(
                document,
                "source_type",
                "",
            )
            or ""
        ).lower()

        if source_type == "document":
            return 0

        if source_type == "search_result":
            return 10

        return 5

    @classmethod
    def process(
        cls,
        document: Any,
        seen: Optional[Set[str]] = None,
    ) -> Dict[str, Any]:

        seen = seen if seen is not None else set()

        if is_dataclass(document):
            payload = asdict(document)

        elif isinstance(document, dict):
            payload = dict(document)

        else:
            payload = {
                key: getattr(
                    document,
                    key,
                )
                for key in getattr(
                    document,
                    "__dataclass_fields__",
                    {},
                )
            }

        fingerprint = cls.fingerprint(payload)

        identity_keys = cls._identity_keys(payload)

        duplicate = any(
            key in seen
            for key in identity_keys
        )

        if not duplicate:
            for key in identity_keys:
                seen.add(key)

        metadata = payload.get("metadata", {})

        if not isinstance(metadata, dict):
            metadata = {}

        metadata.update(
            {
                "deduplication_stage": "knowledge",
                "fingerprint": fingerprint,
                "duplicate": duplicate,
                "identity_keys": identity_keys,
                "deduplication_priority": cls._priority(payload),
            }
        )

        payload["fingerprint"] = fingerprint
        payload["duplicate"] = duplicate
        payload["metadata"] = metadata

        return payload

    @classmethod
    def process_many(
        cls,
        documents,
        seen: Optional[Set[str]] = None,
    ):
        """
        ترتيب العناصر قبل إزالة التكرار حتى تكون
        الوثائق الكاملة أسبق من نتائج البحث.
        """

        seen = seen if seen is not None else set()

        documents = list(documents or [])

        documents.sort(
            key=cls._priority
        )

        return [
            cls.process(
                document,
                seen,
            )
            for document in documents
        ]

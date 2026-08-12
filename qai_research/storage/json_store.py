import json
from pathlib import Path
from threading import Lock
from typing import Any, Dict, List, Optional


class JSONResearchStore:
    """
    مخزن محلي لبيانات منظومة QAI Research.

    يستخدم JSON Lines:
    - سجل مستقل لكل وثيقة.
    - إضافة append بدون إعادة كتابة الملف كاملًا.
    - مناسب للمرحلة الحالية قبل الانتقال إلى مخزن أكبر.

    لا يتصل بـ QAI ولا يغير معماريته.
    """

    name = "json"

    def __init__(
        self,
        root: str = "qai_research/data",
    ):
        self.root = Path(root)
        self.root.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.documents_file = (
            self.root / "documents.jsonl"
        )

        self.research_file = (
            self.root / "research.jsonl"
        )

        self._lock = Lock()

    def save_document(
        self,
        document: Any,
    ) -> bool:

        payload = self._serialize(
            document
        )

        return self._append(
            self.documents_file,
            payload,
        )

    def save_research(
        self,
        research: Any,
    ) -> bool:

        payload = self._serialize(
            research
        )

        return self._append(
            self.research_file,
            payload,
        )

    def list_documents(
        self,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:

        return self._read(
            self.documents_file,
            limit,
        )

    def list_research(
        self,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:

        return self._read(
            self.research_file,
            limit,
        )

    @staticmethod
    def _serialize(
        value: Any,
    ) -> Dict[str, Any]:

        if hasattr(
            value,
            "__dataclass_fields__",
        ):
            from dataclasses import asdict

            return asdict(value)

        if isinstance(
            value,
            dict,
        ):
            return value

        raise TypeError(
            "Unsupported value type"
        )

    def _append(
        self,
        path: Path,
        payload: Dict[str, Any],
    ) -> bool:

        try:
            with self._lock:
                with path.open(
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

    @staticmethod
    def _read(
        path: Path,
        limit: int,
    ) -> List[Dict[str, Any]]:

        if not path.exists():
            return []

        limit = max(
            0,
            int(limit),
        )

        if limit == 0:
            return []

        records = []

        try:
            with path.open(
                "r",
                encoding="utf-8",
            ) as handle:

                for line in handle:
                    line = line.strip()

                    if not line:
                        continue

                    try:
                        records.append(
                            json.loads(line)
                        )
                    except json.JSONDecodeError:
                        continue

                    if len(records) >= limit:
                        break

        except OSError:
            return []

        return records

    def health(self):
        return {
            "name": self.name,
            "root": str(self.root),
            "documents_file": str(
                self.documents_file
            ),
            "research_file": str(
                self.research_file
            ),
            "documents_exists": (
                self.documents_file.exists()
            ),
            "research_exists": (
                self.research_file.exists()
            ),
        }

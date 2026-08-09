from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List


@dataclass
class KnowledgeDocument:
    document_id: str
    category: str
    name: str
    content: str
    source: str


class KnowledgeBuilder:
    """
    Builds structured knowledge documents from the official
    Quavron knowledge directory.

    This component deliberately reads documentation only.
    It never scans or imports application source code.
    """

    ALLOWED_EXTENSIONS = {".md", ".txt", ".json", ".yaml", ".yml"}

    def __init__(self, root: str | Path):
        self.root = Path(root).resolve()

    def build(self) -> List[KnowledgeDocument]:
        if not self.root.exists():
            raise FileNotFoundError(
                f"Knowledge directory does not exist: {self.root}"
            )

        if not self.root.is_dir():
            raise NotADirectoryError(
                f"Knowledge root is not a directory: {self.root}"
            )

        documents: List[KnowledgeDocument] = []

        for path in sorted(self.root.rglob("*")):
            if not path.is_file():
                continue

            if path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
                continue

            documents.append(self._read_document(path))

        return documents

    def _read_document(self, path: Path) -> KnowledgeDocument:
        relative = path.relative_to(self.root)

        parts = relative.parts

        category = parts[0] if len(parts) > 1 else "general"
        name = path.stem

        content = path.read_text(
            encoding="utf-8"
        ).strip()

        document_id = str(relative.with_suffix("")).replace(
            "\\",
            "/",
        )

        return KnowledgeDocument(
            document_id=document_id,
            category=category,
            name=name,
            content=content,
            source=str(relative).replace("\\", "/"),
        )

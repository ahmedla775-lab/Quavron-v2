from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import List

from .knowledge_builder import KnowledgeDocument


@dataclass
class KnowledgeItem:
    item_type: str
    key: str
    value: str
    source: str
    metadata: dict = field(default_factory=dict)


class KnowledgeParser:
    """
    Converts official Quavron documentation into structured
    knowledge items.

    This parser does not access application source code and
    does not use external AI services.
    """

    def parse(
        self,
        document: KnowledgeDocument,
    ) -> List[KnowledgeItem]:
        items: List[KnowledgeItem] = []

        if document.category == "faq":
            items.extend(self._parse_faq(document))

        elif document.category == "features":
            items.extend(self._parse_feature(document))

        elif document.category == "company":
            items.extend(self._parse_company(document))

        elif document.category == "platform":
            items.extend(self._parse_platform(document))

        else:
            items.append(
                KnowledgeItem(
                    item_type="document",
                    key=document.name,
                    value=document.content,
                    source=document.source,
                    metadata={"category": document.category},
                )
            )

        return items

    def parse_many(
        self,
        documents: List[KnowledgeDocument],
    ) -> List[KnowledgeItem]:
        items: List[KnowledgeItem] = []

        for document in documents:
            items.extend(self.parse(document))

        return items

    def _parse_company(
        self,
        document: KnowledgeDocument,
    ) -> List[KnowledgeItem]:
        return [
            KnowledgeItem(
                item_type="concept",
                key="company.name",
                value="Quavron",
                source=document.source,
                metadata={"category": "company"},
            ),
            KnowledgeItem(
                item_type="fact",
                key="company.description",
                value=self._clean_content(document.content),
                source=document.source,
                metadata={"category": "company"},
            ),
        ]

    def _parse_platform(
        self,
        document: KnowledgeDocument,
    ) -> List[KnowledgeItem]:
        return [
            KnowledgeItem(
                item_type="concept",
                key="platform.name",
                value="Quavron",
                source=document.source,
                metadata={"category": "platform"},
            ),
            KnowledgeItem(
                item_type="fact",
                key="platform.description",
                value=self._clean_content(document.content),
                source=document.source,
                metadata={"category": "platform"},
            ),
        ]

    def _parse_feature(
        self,
        document: KnowledgeDocument,
    ) -> List[KnowledgeItem]:
        feature_name = document.name.replace("_", " ").strip()

        return [
            KnowledgeItem(
                item_type="feature",
                key=f"feature.{document.name}",
                value=self._clean_content(document.content),
                source=document.source,
                metadata={
                    "category": "feature",
                    "name": feature_name,
                },
            )
        ]

    def _parse_faq(
        self,
        document: KnowledgeDocument,
    ) -> List[KnowledgeItem]:
        items: List[KnowledgeItem] = []

        pattern = re.compile(
            r"Q:\s*(.*?)\s*"
            r"A:\s*(.*?)(?=\n\s*Q:|\Z)",
            re.DOTALL,
        )

        for index, match in enumerate(
            pattern.finditer(document.content),
            start=1,
        ):
            question = self._clean(match.group(1))
            answer = self._clean(match.group(2))

            if not question or not answer:
                continue

            items.append(
                KnowledgeItem(
                    item_type="faq",
                    key=f"faq.{index}",
                    value=answer,
                    source=document.source,
                    metadata={
                        "question": question,
                    },
                )
            )

        return items

    @staticmethod
    def _clean_content(content: str) -> str:
        lines = []

        for line in content.splitlines():
            line = line.strip()

            if not line:
                continue

            if line.startswith("#"):
                continue

            lines.append(line)

        return " ".join(lines)

    @staticmethod
    def _clean(value: str) -> str:
        return " ".join(value.split())

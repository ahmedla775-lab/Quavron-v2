from __future__ import annotations

from typing import Any, Iterable

from ..research.models import KnowledgeItem


class ResearchKnowledgeAdapter:
    """
    Converts validated research KnowledgeItem objects into the
    dictionary structure accepted by KnowledgeRepository.

    This adapter does not validate knowledge itself.

    Validation must happen before adaptation.
    """

    def adapt(self, item: KnowledgeItem) -> dict[str, Any]:
        if not isinstance(item, KnowledgeItem):
            raise TypeError(
                "item must be a research KnowledgeItem"
            )

        statement = str(
            item.statement or ""
        ).strip()

        subject = str(
            item.subject or "web"
        ).strip()

        knowledge_type = str(
            item.knowledge_type or "fact"
        ).strip()

        sources = [
            str(source).strip()
            for source in (item.sources or [])
            if str(source).strip()
        ]

        evidence = []

        for evidence_item in item.evidence or []:
            evidence.append(
                {
                    "statement": str(
                        evidence_item.statement or ""
                    ).strip(),
                    "source_url": str(
                        evidence_item.source_url or ""
                    ).strip(),
                    "confidence": float(
                        evidence_item.confidence
                    ),
                    "context": str(
                        evidence_item.context or ""
                    ).strip(),
                    "metadata": dict(
                        evidence_item.metadata or {}
                    ),
                }
            )

        return {
            "type": knowledge_type,
            "item_type": knowledge_type,
            "key": self._make_key(
                subject,
                statement,
            ),
            "value": statement,
            "subject": subject,
            "statement": statement,
            "source": "research",
            "sources": sources,
            "confidence": float(item.confidence),
            "evidence": evidence,
            "metadata": {
                **dict(item.metadata or {}),
                "research": True,
                "knowledge_type": knowledge_type,
            },
        }

    def adapt_many(
        self,
        items: Iterable[KnowledgeItem],
    ) -> list[dict[str, Any]]:
        result: list[dict[str, Any]] = []

        for item in items:
            result.append(
                self.adapt(item)
            )

        return result

    @staticmethod
    def _make_key(
        subject: str,
        statement: str,
    ) -> str:
        subject = (
            subject.strip()
            .lower()
            .replace(" ", "_")
        )

        statement = (
            statement.strip()
            .lower()
            .replace(" ", "_")
        )

        statement = statement[:80]

        return (
            f"research.{subject}.{statement}"
        )

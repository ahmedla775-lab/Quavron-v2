from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .models import KnowledgeItem, ResearchSource


@dataclass
class ValidationResult:
    accepted: bool
    confidence: float
    reason: str
    metadata: dict[str, Any]


class ResearchValidator:
    """
    Local deterministic validator for research knowledge.

    The validator does not use external AI.
    It checks basic structural and provenance requirements
    before research knowledge can enter the knowledge layer.
    """

    MIN_CONFIDENCE = 0.60
    MIN_STATEMENT_LENGTH = 20

    def validate(
        self,
        item: KnowledgeItem,
        source: ResearchSource | None = None,
    ) -> ValidationResult:
        if item is None:
            return ValidationResult(
                accepted=False,
                confidence=0.0,
                reason="empty_item",
                metadata={},
            )

        statement = str(
            getattr(item, "statement", "") or ""
        ).strip()

        if not statement:
            return ValidationResult(
                accepted=False,
                confidence=0.0,
                reason="empty_statement",
                metadata={},
            )

        if len(statement) < self.MIN_STATEMENT_LENGTH:
            return ValidationResult(
                accepted=False,
                confidence=0.0,
                reason="statement_too_short",
                metadata={
                    "length": len(statement),
                },
            )

        item_confidence = self._confidence(item)

        if item_confidence < self.MIN_CONFIDENCE:
            return ValidationResult(
                accepted=False,
                confidence=item_confidence,
                reason="low_confidence",
                metadata={
                    "item_confidence": item_confidence,
                },
            )

        sources = list(
            getattr(item, "sources", []) or []
        )

        if not sources and source is not None:
            source_url = str(
                getattr(source, "url", "") or ""
            ).strip()

            if source_url:
                sources = [source_url]

        if not sources:
            return ValidationResult(
                accepted=False,
                confidence=item_confidence,
                reason="missing_source",
                metadata={},
            )

        valid_sources = [
            str(url).strip()
            for url in sources
            if str(url).strip().startswith(
                ("http://", "https://")
            )
        ]

        if not valid_sources:
            return ValidationResult(
                accepted=False,
                confidence=item_confidence,
                reason="invalid_source",
                metadata={
                    "sources": sources,
                },
            )

        return ValidationResult(
            accepted=True,
            confidence=item_confidence,
            reason="accepted",
            metadata={
                "sources": valid_sources,
                "source_count": len(valid_sources),
                "statement_length": len(statement),
            },
        )

    def validate_many(
        self,
        items: list[KnowledgeItem],
    ) -> list[ValidationResult]:
        return [
            self.validate(item)
            for item in items
        ]

    @staticmethod
    def _confidence(item: Any) -> float:
        try:
            value = float(
                getattr(item, "confidence", 0.0)
            )
        except (TypeError, ValueError):
            return 0.0

        return max(
            0.0,
            min(1.0, value),
        )

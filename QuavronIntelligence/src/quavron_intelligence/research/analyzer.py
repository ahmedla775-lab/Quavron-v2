from __future__ import annotations

import re
from typing import Any

from .models import Evidence, KnowledgeItem, ResearchSource


class ResearchAnalyzer:
    """
    Converts extracted web pages into structured evidence
    and knowledge candidates.

    This layer is deliberately local and does not require
    an external AI provider.
    """

    def analyze_source(
        self,
        source: ResearchSource,
    ) -> tuple[list[Evidence], list[KnowledgeItem]]:
        text = " ".join(str(source.content or "").split()).strip()

        if not text:
            return [], []

        sentences = [
            sentence.strip()
            for sentence in re.split(r"(?<=[.!?؟])\s+", text)
            if sentence.strip()
        ]

        evidence: list[Evidence] = []
        knowledge: list[KnowledgeItem] = []

        for sentence in sentences[:20]:
            if len(sentence) < 20:
                continue

            evidence_item = Evidence(
                statement=sentence,
                source_url=source.url,
                confidence=0.7,
                context=text[:500],
            )

            evidence.append(evidence_item)

            knowledge.append(
                KnowledgeItem(
                    subject=source.title or source.domain or "web",
                    statement=sentence,
                    knowledge_type="web_fact",
                    confidence=0.7,
                    sources=[source.url],
                    evidence=[evidence_item],
                )
            )

        return evidence, knowledge

    def analyze_pages(
        self,
        pages: list[dict[str, Any]],
    ) -> tuple[
        list[ResearchSource],
        list[Evidence],
        list[KnowledgeItem],
    ]:
        sources: list[ResearchSource] = []
        all_evidence: list[Evidence] = []
        all_knowledge: list[KnowledgeItem] = []

        for page in pages:
            url = str(page.get("url", "")).strip()

            if not url:
                continue

            source = ResearchSource(
                url=url,
                title=str(page.get("title", "")).strip(),
                source_type="web",
                domain=url.split("/")[2] if "://" in url else "",
                content=str(page.get("text", "")).strip(),
                metadata={
                    "status_code": page.get("status_code"),
                    "content_type": page.get("content_type"),
                },
            )

            sources.append(source)

            evidence, knowledge = self.analyze_source(source)

            all_evidence.extend(evidence)
            all_knowledge.extend(knowledge)

        return sources, all_evidence, all_knowledge

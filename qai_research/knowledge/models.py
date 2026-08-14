from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class KnowledgeItem:
    knowledge_id: str

    raw_id: str
    query: str

    title: str = ""
    url: str = ""
    source_type: str = ""
    engine: str = ""

    language: str = "unknown"

    facts: List[str] = field(default_factory=list)
    entities: List[str] = field(default_factory=list)
    terms: List[str] = field(default_factory=list)
    concepts: List[str] = field(default_factory=list)

    source_text: str = ""

    quality_score: float = 0.0
    confidence: float = 0.0

    metadata: Dict[str, Any] = field(default_factory=dict)

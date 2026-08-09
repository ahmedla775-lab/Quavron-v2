from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class ResearchRequest:
    query: str
    max_sources: int = 5
    language: Optional[str] = None
    topic: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ResearchSource:
    url: str
    title: str = ""
    source_type: str = "web"
    domain: str = ""
    content: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class Evidence:
    statement: str
    source_url: str
    confidence: float = 0.0
    context: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class KnowledgeItem:
    subject: str
    statement: str
    knowledge_type: str = "fact"
    confidence: float = 0.0
    sources: List[str] = field(default_factory=list)
    evidence: List[Evidence] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ResearchResult:
    query: str
    success: bool
    sources: List[ResearchSource] = field(default_factory=list)
    evidence: List[Evidence] = field(default_factory=list)
    knowledge: List[KnowledgeItem] = field(default_factory=list)
    summary: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

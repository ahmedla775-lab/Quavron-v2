from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class SearchResult:
    """
    نتيجة خام من محرك بحث.
    """

    title: str
    url: str
    snippet: str = ""
    engine: str = ""
    rank: int = 0
    score: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PageDocument:
    """
    صفحة ويب بعد جلبها واستخراج محتواها.
    """

    url: str
    title: str = ""
    content: str = ""
    language: Optional[str] = None
    source_engine: str = ""
    fetched: bool = False
    status_code: Optional[int] = None
    content_type: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ResearchRequest:
    """
    طلب بحث مستقل عن QAI.
    """

    query: str
    language: Optional[str] = None
    max_results: int = 10
    max_pages: int = 5
    include_web: bool = True
    include_wikipedia: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ResearchResult:
    """
    النتيجة النهائية لمنظومة البحث.
    """

    query: str

    search_results: List[SearchResult] = field(default_factory=list)

    documents: List[PageDocument] = field(default_factory=list)

    rejected_urls: List[str] = field(default_factory=list)

    sources_used: List[str] = field(default_factory=list)

    errors: List[str] = field(default_factory=list)

    success: bool = False

    metadata: Dict[str, Any] = field(default_factory=dict)

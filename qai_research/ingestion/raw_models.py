from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict


@dataclass
class RawKnowledge:
    raw_id: str
    query: str
    title: str = ""
    url: str = ""
    snippet: str = ""
    content: str = ""
    engine: str = ""
    source_type: str = "search_result"
    metadata: Dict[str, Any] = field(default_factory=dict)

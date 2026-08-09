from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Any


@dataclass
class Page:
    url: str
    html: str = ""
    content: str = ""
    status_code: int = 200
    content_type: str = "text/html"
    error: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        if not self.html and self.content:
            self.html = self.content

        if not self.content and self.html:
            self.content = self.html

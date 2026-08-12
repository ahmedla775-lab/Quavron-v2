from abc import ABC, abstractmethod
from typing import List

from qai_research.core.models import PageDocument


class ResearchCrawler(ABC):
    """
    العقد الأساسي لأي crawler داخل QAI Research.
    """

    name = "unknown"

    @abstractmethod
    def crawl(
        self,
        urls: List[str],
        max_pages: int = 10,
        max_depth: int = 1,
    ) -> List[PageDocument]:
        raise NotImplementedError

    def health(self):
        return {
            "name": self.name,
        }

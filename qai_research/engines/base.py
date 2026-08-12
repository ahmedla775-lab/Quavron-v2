from abc import ABC, abstractmethod
from typing import List

from qai_research.core.models import SearchResult, ResearchRequest


class SearchEngine(ABC):
    """
    العقد الأساسي لأي محرك بحث داخل QAI Research.

    لا علاقة له حاليًا بـ QAI نفسه.
    """

    name = "unknown"
    priority = 100

    def __init__(self):
        self.last_error = None

    @abstractmethod
    def search(
        self,
        request: ResearchRequest,
    ) -> List[SearchResult]:
        """
        تنفيذ البحث وإرجاع نتائج موحدة.
        """
        raise NotImplementedError

    def available(self) -> bool:
        """
        هل المحرك جاهز للاستخدام؟
        """
        return True

    def reset_error(self):
        self.last_error = None

    def set_error(self, error):
        self.last_error = str(error)

    def health(self):
        return {
            "name": self.name,
            "priority": self.priority,
            "available": self.available(),
            "last_error": self.last_error,
        }

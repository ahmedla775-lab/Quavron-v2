from .models import (
    ResearchRequest,
    ResearchSource,
    Evidence,
    KnowledgeItem,
    ResearchResult,
)

__all__ = [
    "ResearchRequest",
    "ResearchSource",
    "Evidence",
    "KnowledgeItem",
    "ResearchResult",
    "ResearchEngine",
]


def __getattr__(name):
    if name == "ResearchEngine":
        from .engine import ResearchEngine
        return ResearchEngine

    raise AttributeError(
        f"module {__name__!r} has no attribute {name!r}"
    )

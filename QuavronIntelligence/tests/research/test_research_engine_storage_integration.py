from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import (
    Evidence,
    KnowledgeItem,
    ResearchRequest,
    ResearchSource,
)


class FakeSearcher:
    def search(self, query):
        return ["https://example.com/math"]


class FakeCrawler:
    def crawl(self, urls):
        class Result:
            pages = [
                {
                    "url": "https://example.com/math",
                    "title": "Mathematics",
                    "text": (
                        "Mathematics is the study of patterns and structures. "
                        "It provides methods for reasoning about quantities, "
                        "space, change, and relationships."
                    ),
                    "status_code": 200,
                    "content_type": "text/html",
                }
            ]

        return Result()


class FakeValidator:
    def validate(self, item):
        class Result:
            accepted = True
            confidence = 0.9
            reason = "accepted"
            metadata = {}

        return Result()


def test_research_engine_stores_validated_knowledge():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=FakeValidator(),
    )

    engine.knowledge_repository = repository

    result = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge

    # This is the critical assertion:
    # validated research knowledge must reach the repository.
    assert repository.count() >= 1

    stored = repository.find("Mathematics")

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["metadata"]["research"] is True


class RejectingValidator:
    def validate(self, item):
        class Result:
            accepted = False
            confidence = 0.2
            reason = "low_confidence"
            metadata = {}

        return Result()


def test_research_engine_does_not_store_rejected_knowledge():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=RejectingValidator(),
    )

    engine.knowledge_repository = repository

    result = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True

    # Rejected knowledge must never enter the repository.
    assert result.knowledge == []
    assert repository.count() == 0

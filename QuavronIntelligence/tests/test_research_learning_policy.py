from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import ResearchRequest


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


class AcceptingValidator:
    def validate(self, item):
        class Result:
            accepted = True
            confidence = 0.9
            reason = "accepted"
            metadata = {}

        return Result()


class RejectingValidator:
    def validate(self, item):
        class Result:
            accepted = False
            confidence = 0.2
            reason = "low_confidence"
            metadata = {}

        return Result()


def test_only_validated_research_becomes_learning():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=AcceptingValidator(),
        knowledge_repository=repository,
    )

    result = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge
    assert repository.count() >= 1

    for item in repository.all():
        assert item["source"] == "research"
        assert item["metadata"]["research"] is True


def test_rejected_research_never_becomes_learning():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=RejectingValidator(),
        knowledge_repository=repository,
    )

    result = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge == []
    assert repository.count() == 0


def test_repeated_research_does_not_duplicate_learning():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=AcceptingValidator(),
        knowledge_repository=repository,
    )

    first = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )
    first_count = repository.count()

    second = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )
    second_count = repository.count()

    assert first.success is True
    assert second.success is True
    assert first_count > 0
    assert second_count == first_count

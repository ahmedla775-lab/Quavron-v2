from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import ResearchRequest
from quavron_intelligence.intelligence import Intelligence


class FakeCoordinator:
    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        return {
            "subject": subject,
            "value": value,
            "memory_type": memory_type,
            "confidence": confidence,
        }

    def recall(self, subject):
        return None

    def reason(self, context):
        return {
            "success": True,
            "context": context,
        }


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


def test_intelligence_can_use_research_repository():
    repository = KnowledgeRepository()

    research = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=FakeValidator(),
    )

    research.knowledge_repository = repository

    result = research.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge
    assert repository.count() >= 1

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
    )

    intelligence.knowledge_repository = repository

    value = intelligence._knowledge_lookup(
        "What is Mathematics?"
    )

    assert value is not None
    assert "patterns" in value

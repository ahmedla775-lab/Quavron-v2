from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import ResearchRequest


class FakeCoordinator:
    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        return {
            "subject": subject,
            "value": value,
        }

    def recall(self, subject):
        return None

    def reason(self, context):
        return context


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


def make_intelligence():
    repository = KnowledgeRepository()

    research_engine = ResearchEngine(
        searcher=FakeSearcher(),
        crawler=FakeCrawler(),
        validator=AcceptingValidator(),
        knowledge_repository=repository,
    )

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    return intelligence, repository


def test_research_then_recall_from_intelligence():
    intelligence, repository = make_intelligence()

    research_result = intelligence.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert research_result.success is True
    assert research_result.knowledge
    assert repository.count() == 2

    response = intelligence.respond(
        "What is mathematics?"
    )

    assert response is not None

    # The answer must contain knowledge learned from research.
    response_text = str(response).lower()

    assert "mathematics" in response_text
    assert "patterns" in response_text


def test_researched_knowledge_is_retrievable_directly():
    intelligence, repository = make_intelligence()

    intelligence.research("mathematics")

    value = intelligence._knowledge_lookup(
        "What is mathematics?"
    )

    assert value is not None
    assert "patterns" in str(value).lower()


def test_research_creates_knowledge_that_survives_repository_lookup():
    intelligence, repository = make_intelligence()

    result = intelligence.research("mathematics")

    assert result.success is True

    stored = repository.find("Mathematics")

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["metadata"]["research"] is True

    lookup = repository.search(
        "mathematics",
        limit=5,
    )

    assert lookup
    assert any(
        "patterns" in str(result["item"].get("value", "")).lower()
        for result in lookup
    )

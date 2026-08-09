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


def test_intelligence_runs_real_research_pipeline_and_stores_knowledge():
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

    result = intelligence.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge

    assert research_engine.knowledge_repository is repository
    assert intelligence.knowledge_repository is repository

    assert repository.count() >= 1

    stored = repository.find("Mathematics")

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["metadata"]["research"] is True
    assert stored["confidence"] == 0.7
    assert stored["sources"] == [
        "https://example.com/math"
    ]


def test_intelligence_research_result_preserves_query_and_metadata():
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

    result = intelligence.research("mathematics")

    assert result.query == "mathematics"
    assert result.success is True
    assert result.metadata["sources_found"] == 1
    assert result.metadata["evidence_count"] >= 1
    assert result.metadata["knowledge_validated"] >= 1

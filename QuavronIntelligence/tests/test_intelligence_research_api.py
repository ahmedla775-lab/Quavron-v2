from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.models import ResearchRequest, ResearchResult


class FakeCoordinator:
    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        return {"subject": subject, "value": value}

    def recall(self, subject):
        return None

    def reason(self, context):
        return context


class FakeResearchEngine:
    def __init__(self):
        self.calls = []

    def research(self, request):
        self.calls.append(request)

        return ResearchResult(
            query=request.query,
            success=True,
            summary="Research completed.",
            metadata={
                "sources_found": 1,
                "knowledge_validated": 1,
            },
        )


def test_intelligence_research_api_accepts_string_query():
    engine = FakeResearchEngine()

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=KnowledgeRepository(),
        research_engine=engine,
    )

    result = intelligence.research("mathematics")

    assert isinstance(result, ResearchResult)
    assert result.success is True
    assert result.query == "mathematics"

    assert len(engine.calls) == 1
    assert isinstance(engine.calls[0], ResearchRequest)
    assert engine.calls[0].query == "mathematics"


def test_intelligence_research_api_accepts_request():
    engine = FakeResearchEngine()

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=KnowledgeRepository(),
        research_engine=engine,
    )

    request = ResearchRequest(
        query="physics",
        max_sources=3,
    )

    result = intelligence.research(request)

    assert result.success is True
    assert result.query == "physics"

    assert len(engine.calls) == 1
    assert engine.calls[0] is request


def test_intelligence_research_requires_engine():
    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=KnowledgeRepository(),
    )

    try:
        intelligence.research("mathematics")
        assert False
    except RuntimeError as exc:
        assert "ResearchEngine" in str(exc)

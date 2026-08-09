from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.models import ResearchResult


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


class FakeResearchEngine:
    def __init__(self):
        self.calls = []

    def research(self, request):
        self.calls.append(request)

        return ResearchResult(
            query=request.query,
            success=True,
            summary="Research completed.",
            knowledge=[
                {
                    "statement": (
                        "Mathematics is the study of patterns and structures."
                    ),
                    "confidence": 0.9,
                }
            ],
            metadata={
                "sources_found": 1,
                "knowledge_validated": 1,
            },
        )


def make_intelligence():
    repository = KnowledgeRepository()
    research_engine = FakeResearchEngine()

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    return intelligence, repository, research_engine


def test_intelligence_can_trigger_research_for_learning():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.research("mathematics")

    assert result.success is True
    assert result.query == "mathematics"
    assert len(research_engine.calls) == 1


def test_research_engine_is_connected_to_shared_repository():
    intelligence, repository, research_engine = make_intelligence()

    assert intelligence.knowledge_repository is repository


def test_continuous_learning_uses_research_pipeline():
    intelligence, _, research_engine = make_intelligence()

    result = intelligence.continuous_learn("mathematics")

    assert result.success is True
    assert result.query == "mathematics"
    assert len(research_engine.calls) == 1


def test_continuous_learning_accepts_research_request():
    from quavron_intelligence.research.models import ResearchRequest

    intelligence, _, research_engine = make_intelligence()

    request = ResearchRequest(
        query="physics",
        max_sources=2,
    )

    result = intelligence.continuous_learn(request)

    assert result.success is True
    assert result.query == "physics"
    assert research_engine.calls[0] is request


def test_continuous_learning_requires_research_engine():
    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=KnowledgeRepository(),
    )

    try:
        intelligence.continuous_learn("mathematics")
        assert False
    except RuntimeError as exc:
        assert "ResearchEngine" in str(exc)

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

    return intelligence, research_engine


def test_known_question_does_not_trigger_auto_research():
    intelligence, research_engine = make_intelligence()

    intelligence.knowledge_repository.add({
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
    })

    assert intelligence._should_research("What is Quavron?") is False
    assert research_engine.calls == []


def test_unknown_question_can_trigger_research():
    intelligence, research_engine = make_intelligence()

    assert intelligence._should_research(
        "What is quantum entanglement?"
    ) is True

    result = intelligence.research(
        "What is quantum entanglement?"
    )

    assert result.success is True
    assert len(research_engine.calls) == 1
    assert research_engine.calls[0].query == (
        "What is quantum entanglement?"
    )


def test_auto_research_method_exists():
    intelligence, _ = make_intelligence()

    assert hasattr(intelligence, "_auto_research")

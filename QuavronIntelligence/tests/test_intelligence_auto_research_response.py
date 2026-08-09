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
            summary="Quantum research completed.",
            knowledge=[],
            metadata={
                "sources_found": 1,
                "knowledge_validated": 0,
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


def test_known_knowledge_does_not_trigger_research():
    intelligence, research_engine = make_intelligence()

    intelligence.knowledge_repository.add({
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
    })

    result = intelligence.respond("What is Quavron?")

    assert research_engine.calls == []
    assert result is not None


def test_unknown_knowledge_triggers_research():
    intelligence, research_engine = make_intelligence()

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert len(research_engine.calls) == 1
    assert research_engine.calls[0].query == (
        "What is quantum entanglement?"
    )
    assert result is not None


def test_reasoning_question_does_not_trigger_auto_research():
    intelligence, research_engine = make_intelligence()

    intelligence.respond(
        "Reason about Quavron platform architecture."
    )

    assert research_engine.calls == []


def test_respond_without_research_engine_does_not_crash():
    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=KnowledgeRepository(),
    )

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None

from quavron_intelligence import IntelligenceEngine, IntelligenceCoordinator, Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository


class FakeResearchEngine:
    def __init__(self):
        self.calls = []

    def research(self, request):
        self.calls.append(request)
        return None


def make_intelligence():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)
    repository = KnowledgeRepository()
    research_engine = FakeResearchEngine()

    intelligence = Intelligence(
        coordinator,
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    return intelligence, repository, research_engine


def test_known_knowledge_prefers_local_recall_over_research():
    intelligence, repository, research_engine = make_intelligence()

    repository.add({
        "subject": "quavron",
        "value": "Quavron is a platform.",
        "memory_type": "FACT",
        "confidence": 1.0,
    })

    assert intelligence._should_research("What is Quavron?") is False
    assert research_engine.calls == []


def test_unknown_knowledge_requires_research():
    intelligence, repository, research_engine = make_intelligence()

    assert intelligence._should_research(
        "What is quantum entanglement?"
    ) is True


def test_reasoning_does_not_trigger_research():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.respond(
        "لماذا Quavron منصة؟"
    )

    assert research_engine.calls == []
    assert result["intent"] == "reasoning"


def test_greeting_does_not_trigger_research():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.respond("مرحبا")

    assert research_engine.calls == []
    assert result["intent"] == "greeting"


def test_help_does_not_trigger_research():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.respond("ساعدني في البرمجة")

    assert research_engine.calls == []
    assert result["intent"] == "help"


def test_learn_does_not_trigger_research():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.respond("احفظ هذه المعلومة")

    assert research_engine.calls == []
    assert result["intent"] == "learn"


def test_unknown_intent_has_explicit_unknown_route():
    intelligence, repository, research_engine = make_intelligence()

    result = intelligence.respond("xyz")

    assert research_engine.calls == []
    assert result["intent"] == "unknown"
    assert result["route"] == "unknown"

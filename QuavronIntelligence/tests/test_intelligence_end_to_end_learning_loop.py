from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.models import ResearchResult, KnowledgeItem


class LearningCoordinator:
    def __init__(self):
        self.memory = {}
        self.learn_calls = []

    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        self.learn_calls.append({
            "subject": subject,
            "value": value,
            "memory_type": memory_type,
            "confidence": confidence,
        })
        self.memory[subject] = value
        return {
            "subject": subject,
            "value": value,
        }

    def recall(self, subject):
        return self.memory.get(subject)

    def reason(self, context):
        return context


class ResearchEngine:
    def __init__(self):
        self.calls = []

    def research(self, request):
        self.calls.append(request)

        item = KnowledgeItem(
            subject="quantum.entanglement",
            statement=(
                "Quantum entanglement is a physical phenomenon "
                "in which quantum systems exhibit correlated states."
            ),
            confidence=0.9,
        )

        return ResearchResult(
            query=request.query,
            success=True,
            summary=item.statement,
            knowledge=[item],
            metadata={
                "sources_found": 1,
                "knowledge_validated": 1,
            },
        )


def make_intelligence():
    coordinator = LearningCoordinator()
    repository = KnowledgeRepository()
    research_engine = ResearchEngine()

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    return intelligence, coordinator, repository, research_engine


def test_unknown_question_researches_learns_and_answers():
    intelligence, coordinator, repository, research_engine = (
        make_intelligence()
    )

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None
    assert len(research_engine.calls) == 1
    assert len(coordinator.learn_calls) == 1

    stored = repository.find("Quantum entanglement")

    assert stored is not None
    assert stored["source"] == "research"

    text = str(result)

    assert "Quantum entanglement" in text


def test_same_question_uses_learned_knowledge_after_research():
    intelligence, coordinator, repository, research_engine = (
        make_intelligence()
    )

    first = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert first is not None
    assert len(research_engine.calls) == 1

    second = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert second is not None

    assert len(research_engine.calls) == 1
    assert len(coordinator.learn_calls) == 1

    text = str(second)

    assert "Quantum entanglement" in text


def test_research_knowledge_and_memory_stay_synchronized():
    intelligence, coordinator, repository, research_engine = (
        make_intelligence()
    )

    intelligence.respond(
        "What is quantum entanglement?"
    )

    stored = repository.find("Quantum entanglement")

    assert stored is not None

    recalled = coordinator.recall(
        "quantum.entanglement"
    )

    assert recalled is not None
    assert "Quantum entanglement" in recalled

    assert len(research_engine.calls) == 1
    assert len(coordinator.learn_calls) == 1

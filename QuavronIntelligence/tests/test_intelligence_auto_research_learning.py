from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.models import KnowledgeItem, ResearchResult


class LearningCoordinator:
    def __init__(self):
        self.learn_calls = []

    def learn(
        self,
        subject,
        value,
        memory_type="FACT",
        confidence=1.0,
    ):
        self.learn_calls.append({
            "subject": subject,
            "value": value,
            "memory_type": memory_type,
            "confidence": confidence,
        })

        return {
            "subject": subject,
            "value": value,
        }

    def recall(self, subject):
        return None

    def reason(self, context):
        return context


class ResearchEngine:
    def __init__(self):
        self.calls = []

    def research(self, request):
        self.calls.append(request)

        value = (
            "Quantum entanglement is a physical phenomenon "
            "in which quantum systems exhibit correlated states."
        )

        return ResearchResult(
            query=request.query,
            success=True,
            summary=value,
            knowledge=[
                KnowledgeItem(
                    subject="quantum entanglement",
                    statement=value,
                    knowledge_type="web_fact",
                    confidence=0.7,
                    sources=[
                        "https://example.com/quantum"
                    ],
                    evidence=[],
                )
            ],
            metadata={
                "sources_found": 1,
                "knowledge_validated": 1,
            },
        )


def make_intelligence():
    coordinator = LearningCoordinator()
    research_engine = ResearchEngine()

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=KnowledgeRepository(),
        research_engine=research_engine,
    )

    return intelligence, coordinator, research_engine


def test_auto_research_learns_validated_knowledge():
    intelligence, coordinator, research_engine = make_intelligence()

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None
    assert len(research_engine.calls) == 1

    assert len(coordinator.learn_calls) == 1

    call = coordinator.learn_calls[0]

    assert call["subject"] == "quantum entanglement"
    assert call["memory_type"] == "FACT"
    assert call["confidence"] == 0.7


def test_auto_research_does_not_learn_same_result_twice():
    intelligence, coordinator, research_engine = make_intelligence()

    intelligence.respond(
        "What is quantum entanglement?"
    )

    intelligence.respond(
        "What is quantum entanglement?"
    )

    assert len(research_engine.calls) == 1
    assert len(coordinator.learn_calls) == 1


def test_auto_research_keeps_repository_and_learning_in_sync():
    intelligence, coordinator, research_engine = make_intelligence()

    intelligence.respond(
        "What is quantum entanglement?"
    )

    stored = intelligence.knowledge_repository.find(
        "Quantum entanglement"
    )

    assert stored is not None
    assert stored["source"] == "research"

    assert len(coordinator.learn_calls) == 1
    assert len(research_engine.calls) == 1

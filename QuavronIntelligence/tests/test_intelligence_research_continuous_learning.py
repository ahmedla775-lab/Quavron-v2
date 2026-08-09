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
    def research(self, request):
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

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=KnowledgeRepository(),
        research_engine=ResearchEngine(),
    )

    return intelligence, coordinator


def test_research_learning_method_exists():
    intelligence, _ = make_intelligence()

    assert hasattr(
        intelligence,
        "_learn_research_result",
    )


def test_research_result_can_be_learned():
    intelligence, coordinator = make_intelligence()

    result = intelligence.research(
        "What is quantum entanglement?"
    )

    assert result.success is True

    learned = intelligence._learn_research_result(result)

    assert learned is True
    assert len(coordinator.learn_calls) == 1

    call = coordinator.learn_calls[0]

    assert call["subject"] == "quantum entanglement"
    assert "Quantum entanglement" in call["value"]
    assert call["memory_type"] == "FACT"
    assert call["confidence"] == 0.7


def test_research_learning_does_not_duplicate():
    intelligence, coordinator = make_intelligence()

    result = intelligence.research(
        "What is quantum entanglement?"
    )

    assert intelligence._learn_research_result(result) is True
    assert intelligence._learn_research_result(result) is False

    assert len(coordinator.learn_calls) == 1

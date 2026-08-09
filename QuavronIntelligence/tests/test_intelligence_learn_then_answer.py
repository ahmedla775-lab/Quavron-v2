from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository


class FakeCoordinator:
    def __init__(self):
        self.memory = {}

    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        self.memory[subject] = value
        return {
            "subject": subject,
            "value": value,
            "memory_type": memory_type,
            "confidence": confidence,
        }

    def recall(self, subject):
        return self.memory.get(subject)

    def reason(self, context):
        return context


def test_learned_fact_can_be_used_in_answer():
    coordinator = FakeCoordinator()
    repository = KnowledgeRepository()

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
    )

    intelligence.learn(
        "quantum.entanglement",
        "Quantum entanglement is a physical phenomenon in which quantum systems exhibit correlated states.",
    )

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None

    text = str(result)

    assert "Quantum entanglement" in text
    assert "correlated states" in text

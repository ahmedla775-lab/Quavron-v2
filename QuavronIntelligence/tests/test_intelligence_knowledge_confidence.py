from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository


class FakeCoordinator:
    def __init__(self):
        self.memory = {}

    def learn(self, subject, value, memory_type="FACT", confidence=1.0):
        self.memory[subject] = {
            "value": value,
            "confidence": confidence,
            "memory_type": memory_type,
        }
        return self.memory[subject]

    def recall(self, subject):
        item = self.memory.get(subject)
        if item is None:
            return None
        return item["value"]

    def reason(self, context):
        return context


def test_learned_fact_preserves_confidence():
    coordinator = FakeCoordinator()
    repository = KnowledgeRepository()

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
    )

    intelligence.learn(
        "quantum.entanglement",
        "Quantum entanglement is a physical phenomenon.",
        confidence=0.7,
    )

    assert coordinator.memory["quantum.entanglement"]["confidence"] == 0.7


def test_learned_fact_preserves_memory_type():
    coordinator = FakeCoordinator()
    repository = KnowledgeRepository()

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
    )

    intelligence.learn(
        "quantum.entanglement",
        "Quantum entanglement is a physical phenomenon.",
        memory_type="RESEARCH_FACT",
        confidence=0.8,
    )

    assert (
        coordinator.memory["quantum.entanglement"]["memory_type"]
        == "RESEARCH_FACT"
    )


def test_repository_can_keep_research_metadata():
    repository = KnowledgeRepository()

    item = {
        "type": "web_fact",
        "item_type": "web_fact",
        "key": "quantum.entanglement",
        "value": "Quantum entanglement is a physical phenomenon.",
        "source": "research",
        "confidence": 0.7,
        "sources": ["https://example.com/quantum"],
        "metadata": {
            "research": True,
            "validated": True,
        },
    }

    assert repository.add_research(item) is True

    stored = repository.find("quantum.entanglement")

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["confidence"] == 0.7
    assert stored["metadata"]["research"] is True
    assert stored["metadata"]["validated"] is True

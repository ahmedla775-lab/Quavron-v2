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


def make_intelligence():
    coordinator = FakeCoordinator()
    repository = KnowledgeRepository()

    return Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
    )


def test_high_confidence_knowledge_is_usable():
    intelligence = make_intelligence()

    intelligence.learn(
        "quantum.entanglement",
        "Quantum entanglement is a physical phenomenon.",
        confidence=0.9,
    )

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None
    assert "Quantum entanglement" in str(result)


def test_low_confidence_memory_is_still_retrievable():
    intelligence = make_intelligence()

    intelligence.learn(
        "quantum.entanglement",
        "Possibly related quantum correlation.",
        confidence=0.3,
    )

    value = intelligence.recall("quantum.entanglement")

    assert value == "Possibly related quantum correlation."


def test_research_metadata_can_be_distinguished_from_official_knowledge():
    repository = KnowledgeRepository()

    repository.add({
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
        "source": "official",
        "confidence": 1.0,
    })

    repository.add_research({
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
    })

    official = repository.find("company.name")
    researched = repository.find("quantum.entanglement")

    assert official is not None
    assert researched is not None

    assert official["source"] == "official"
    assert researched["source"] == "research"

    assert official["confidence"] == 1.0
    assert researched["confidence"] == 0.7

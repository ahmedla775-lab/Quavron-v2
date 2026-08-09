from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import ResearchRequest


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


class FakeSearcher:
    def __init__(self):
        self.calls = []

    def search(self, query):
        self.calls.append(query)
        return ["https://example.com/quantum"]


class FakeCrawler:
    def crawl(self, urls):
        class Result:
            pages = [{
                "url": "https://example.com/quantum",
                "title": "Quantum Entanglement",
                "text": (
                    "Quantum entanglement is a physical phenomenon "
                    "in which quantum systems exhibit correlated states."
                ),
                "status_code": 200,
                "content_type": "text/html",
            }]

        return Result()


class AcceptingValidator:
    def validate(self, item):
        class Result:
            accepted = True
            confidence = 0.9
            reason = "accepted"
            metadata = {}

        return Result()


def make_intelligence():
    repository = KnowledgeRepository()
    coordinator = LearningCoordinator()

    searcher = FakeSearcher()

    engine = ResearchEngine(
        searcher=searcher,
        crawler=FakeCrawler(),
        validator=AcceptingValidator(),
        knowledge_repository=repository,
    )

    intelligence = Intelligence(
        coordinator=coordinator,
        knowledge_repository=repository,
        research_engine=engine,
    )

    return intelligence, coordinator, searcher


def test_research_then_recall_avoids_second_research():
    intelligence, coordinator, searcher = make_intelligence()

    question = "What is quantum entanglement?"

    first = intelligence.respond(question)

    assert first is not None
    assert len(searcher.calls) == 1
    assert coordinator.learn_calls

    second = intelligence.respond(question)

    assert second is not None

    # The second request must use the knowledge already learned.
    assert len(searcher.calls) == 1


def test_research_then_recall_preserves_learned_knowledge():
    intelligence, coordinator, searcher = make_intelligence()

    question = "What is quantum entanglement?"

    intelligence.respond(question)

    assert coordinator.memory

    second = intelligence.respond(question)

    text = str(second)

    assert "Quantum entanglement" in text
    assert len(searcher.calls) == 1


def test_research_then_recall_keeps_repository_and_memory_consistent():
    intelligence, coordinator, searcher = make_intelligence()

    intelligence.respond(
        "What is quantum entanglement?"
    )

    stored = intelligence.knowledge_repository.find(
        "Quantum entanglement"
    )

    assert stored is not None
    assert coordinator.memory

    assert len(searcher.calls) == 1

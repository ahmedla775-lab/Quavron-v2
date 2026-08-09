from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.models import KnowledgeItem, ResearchResult


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


class LearningResearchEngine:
    def __init__(self, repository):
        self.repository = repository
        self.calls = []

    def research(self, request):
        self.calls.append(request)

        item = {
            "type": "web_fact",
            "key": "research.quantum.entanglement",
            "value": (
                "Quantum entanglement is a physical phenomenon "
                "in which quantum systems exhibit correlated states."
            ),
            "source": "research",
            "confidence": 0.7,
            "sources": [
                "https://example.com/quantum"
            ],
            "metadata": {
                "research": True,
            },
        }

        self.repository.add_research(item)

        return ResearchResult(
            query=request.query,
            success=True,
            summary=item["value"],
            knowledge=[
                KnowledgeItem(
                    subject="quantum",
                    statement=item["value"],
                    knowledge_type="web_fact",
                    confidence=0.7,
                    sources=item["sources"],
                    evidence=[],
                )
            ],
            metadata={
                "sources_found": 1,
                "knowledge_validated": 1,
            },
        )


def make_intelligence():
    repository = KnowledgeRepository()

    research_engine = LearningResearchEngine(repository)

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    return intelligence, research_engine


def test_research_result_becomes_local_knowledge():
    intelligence, research_engine = make_intelligence()

    result = intelligence.respond(
        "What is quantum entanglement?"
    )

    assert result is not None
    assert len(research_engine.calls) == 1

    stored = intelligence.knowledge_repository.find(
        "Quantum entanglement"
    )

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["metadata"]["research"] is True


def test_second_question_does_not_repeat_research():
    intelligence, research_engine = make_intelligence()

    intelligence.respond(
        "What is quantum entanglement?"
    )

    first_call_count = len(research_engine.calls)

    intelligence.respond(
        "What is quantum entanglement?"
    )

    assert first_call_count == 1
    assert len(research_engine.calls) == 1


def test_research_memory_loop_preserves_research_source():
    intelligence, research_engine = make_intelligence()

    intelligence.respond(
        "What is quantum entanglement?"
    )

    stored = intelligence.knowledge_repository.find(
        "Quantum entanglement"
    )

    assert stored is not None
    assert stored["source"] == "research"
    assert stored["confidence"] == 0.7

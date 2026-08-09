from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository
from quavron_intelligence.research.engine import ResearchEngine


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


def test_intelligence_accepts_research_engine():
    repository = KnowledgeRepository()
    research_engine = ResearchEngine(
        knowledge_repository=repository,
    )

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
        research_engine=research_engine,
    )

    assert intelligence.research_engine is research_engine
    assert intelligence.knowledge_repository is repository
    assert research_engine.knowledge_repository is repository

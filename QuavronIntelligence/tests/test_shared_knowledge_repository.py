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


def test_intelligence_accepts_shared_knowledge_repository():
    repository = KnowledgeRepository()

    intelligence = Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
    )

    assert intelligence.knowledge_repository is repository


def test_research_engine_accepts_shared_knowledge_repository():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        knowledge_repository=repository,
    )

    assert engine.knowledge_repository is repository

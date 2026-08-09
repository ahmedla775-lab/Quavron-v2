from quavron_intelligence.intelligence import Intelligence
from quavron_intelligence.knowledge.repository import KnowledgeRepository


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


class FakeResearchEngine:
    def research(self, request):
        raise AssertionError(
            "Research must not run when local knowledge is sufficient."
        )


def make_intelligence():
    repository = KnowledgeRepository()

    repository.add({
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
    })

    return Intelligence(
        coordinator=FakeCoordinator(),
        knowledge_repository=repository,
        research_engine=FakeResearchEngine(),
    )


def test_auto_learning_is_not_triggered_for_known_information():
    intelligence = make_intelligence()

    value = intelligence._knowledge_lookup("What is Quavron?")

    assert value == "Quavron"


def test_auto_learning_decision_method_exists():
    intelligence = make_intelligence()

    assert hasattr(intelligence, "_should_research")


def test_known_question_does_not_require_research():
    intelligence = make_intelligence()

    assert intelligence._should_research("What is Quavron?") is False


def test_unknown_question_requires_research():
    intelligence = make_intelligence()

    assert intelligence._should_research(
        "What is quantum entanglement?"
    ) is True

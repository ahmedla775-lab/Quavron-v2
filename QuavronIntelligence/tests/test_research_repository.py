from quavron_intelligence.knowledge.repository import (
    KnowledgeRepository,
)


def test_repository_accepts_research_knowledge():
    repository = KnowledgeRepository()

    item = {
        "type": "web_fact",
        "key": "research.mathematics.example",
        "value": "Mathematics is the study of patterns and structures.",
        "source": "research",
        "confidence": 0.7,
        "metadata": {
            "research": True,
        },
    }

    assert repository.add_research(item) is True
    assert repository.count() == 1

    stored = repository.find("Mathematics")

    assert stored is not None
    assert stored["source"] == "research"


def test_repository_rejects_unmarked_research():
    repository = KnowledgeRepository()

    item = {
        "type": "web_fact",
        "key": "research.invalid",
        "value": "This was not validated.",
        "source": "research",
    }

    assert repository.add_research(item) is False
    assert repository.count() == 0


def test_repository_still_accepts_official_knowledge():
    repository = KnowledgeRepository()

    item = {
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
    }

    repository.add(item)

    assert repository.count() == 1

from quavron_intelligence.knowledge.repository import KnowledgeRepository


def make_item(key, value):
    return {
        "type": "web_fact",
        "item_type": "web_fact",
        "key": key,
        "value": value,
        "source": "research",
        "confidence": 0.9,
        "metadata": {
            "research": True,
        },
    }


def test_repository_deduplicates_same_research_key():
    repository = KnowledgeRepository()

    item = make_item(
        "research.mathematics.patterns",
        "Mathematics studies patterns and structures.",
    )

    assert repository.add_research(item) is True
    assert repository.add_research(item) is False

    assert repository.count() == 1


def test_repository_keeps_different_research_keys():
    repository = KnowledgeRepository()

    first = make_item(
        "research.mathematics.patterns",
        "Mathematics studies patterns and structures.",
    )

    second = make_item(
        "research.mathematics.reasoning",
        "Mathematics provides methods for reasoning.",
    )

    assert repository.add_research(first) is True
    assert repository.add_research(second) is True

    assert repository.count() == 2


def test_repository_deduplication_does_not_affect_official_knowledge():
    repository = KnowledgeRepository()

    official = {
        "type": "concept",
        "key": "company.name",
        "value": "Quavron",
    }

    repository.add(official)
    repository.add(official)

    assert repository.count() == 2

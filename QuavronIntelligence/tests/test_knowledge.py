from quavron_intelligence import KnowledgeCore


def test_add_and_find_fact():
    knowledge = KnowledgeCore()

    fact = knowledge.add_fact(
        "Quavron",
        "type",
        "platform",
    )

    assert fact.subject == "Quavron"
    assert fact.predicate == "type"
    assert fact.value == "platform"
    assert fact.confidence == 1.0


def test_find_by_subject():
    knowledge = KnowledgeCore()

    knowledge.add_fact(
        "Quavron",
        "type",
        "platform",
    )

    knowledge.add_fact(
        "QAI",
        "type",
        "intelligence",
    )

    results = knowledge.find(subject="Quavron")

    assert len(results) == 1
    assert results[0].value == "platform"


def test_find_by_predicate():
    knowledge = KnowledgeCore()

    knowledge.add_fact("Quavron", "type", "platform")
    knowledge.add_fact("QAI", "type", "intelligence")

    results = knowledge.find(predicate="type")

    assert len(results) == 2


def test_confidence_is_bounded():
    knowledge = KnowledgeCore()

    high = knowledge.add_fact(
        "Quavron",
        "type",
        "platform",
        confidence=5,
    )

    low = knowledge.add_fact(
        "QAI",
        "type",
        "assistant",
        confidence=-2,
    )

    assert high.confidence == 1.0
    assert low.confidence == 0.0


def test_count_and_clear():
    knowledge = KnowledgeCore()

    knowledge.add_fact("Quavron", "type", "platform")

    assert knowledge.count() == 1

    knowledge.clear()

    assert knowledge.count() == 0

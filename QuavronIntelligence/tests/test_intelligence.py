from quavron_intelligence import (
    IntelligenceEngine,
    IntelligenceCoordinator,
    Intelligence,
)


def make_intelligence():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)

    return Intelligence(coordinator)


def test_unified_greeting():
    intelligence = make_intelligence()

    result = intelligence.process(
        "مرحبا يا QAI"
    )

    assert result["success"] is True
    assert result["intent"] == "greeting"
    assert result["route"] == "conversation"
    assert result["response"]["metadata"]["source"] == "local"


def test_unified_knowledge():
    intelligence = make_intelligence()

    intelligence.learn(
        "Quavron",
        "Next Generation Platform",
    )

    result = intelligence.process(
        "ما هي Quavron؟"
    )

    assert result["intent"] == "knowledge"
    assert result["route"] == "knowledge"
    assert result["response"]["content"] == "Next Generation Platform"


def test_unified_reasoning():
    intelligence = make_intelligence()

    intelligence.coordinator.engine.add_rule(
        lambda context: context.get("type") == "platform",
        lambda context: "Quavron is a platform",
    )

    result = intelligence.process(
        "لماذا Quavron منصة؟"
    )

    assert result["intent"] == "reasoning"
    assert result["route"] == "reasoning"

    reasoning = result["response"]["content"]

    assert reasoning["success"] is True
    assert "Quavron is a platform" in reasoning["results"]


def test_unified_learning():
    intelligence = make_intelligence()

    result = intelligence.learn(
        "QAI",
        "intelligent assistant",
    )

    assert result["success"] is True
    assert intelligence.recall("QAI") == "intelligent assistant"


def test_unified_unknown():
    intelligence = make_intelligence()

    result = intelligence.process(
        "xyz"
    )

    assert result["success"] is True
    assert result["intent"] == "unknown"
    assert result["route"] == "unknown"


def test_unified_knowledge_unknown():
    intelligence = make_intelligence()

    result = intelligence.process(
        "ما هي اليابان؟"
    )

    assert result["intent"] == "knowledge"
    assert result["response"]["content"] == (
        "لا أملك هذه المعلومة حاليًا."
    )

from quavron_intelligence import IntelligenceEngine
from quavron_intelligence.coordinator import IntelligenceCoordinator


def test_coordinator_learn_and_recall():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)

    result = coordinator.learn(
        "Quavron",
        "Next Generation Platform",
    )

    assert result["success"] is True
    assert coordinator.recall("Quavron") == "Next Generation Platform"


def test_coordinator_reasoning():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)

    engine.add_rule(
        lambda context: context.get("type") == "platform",
        lambda context: "Quavron is a platform",
    )

    result = coordinator.reason({"type": "platform"})

    assert result["success"] is True
    assert "Quavron is a platform" in result["results"]


def test_coordinator_process():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)

    coordinator.learn(
        "QAI",
        "intelligent assistant",
    )

    result = coordinator.process(
        subject="QAI",
        context={"type": "assistant"},
    )

    assert result["success"] is True
    assert result["knowledge"] == "intelligent assistant"
    assert "reasoning" in result


def test_coordinator_rejects_invalid_context():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)

    try:
        coordinator.reason("invalid")
        assert False
    except TypeError:
        assert True

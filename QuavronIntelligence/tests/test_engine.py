from quavron_intelligence import IntelligenceEngine


def test_engine_initialization():
    engine = IntelligenceEngine()

    assert engine.VERSION == "0.1.0"
    assert engine.knowledge == {}
    assert engine.rules == []


def test_learning_and_recall():
    engine = IntelligenceEngine()

    result = engine.learn(
        "quavron",
        "Next Generation Platform",
    )

    assert result["success"] is True
    assert engine.recall("quavron") == "Next Generation Platform"


def test_reasoning():
    engine = IntelligenceEngine()

    engine.add_rule(
        lambda context: context.get("type") == "platform",
        lambda context: "platform detected",
    )

    result = engine.reason(
        {
            "type": "platform",
        }
    )

    assert result["success"] is True
    assert result["results"] == ["platform detected"]
    assert result["rules_evaluated"] == 1

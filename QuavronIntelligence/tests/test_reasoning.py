from quavron_intelligence.reasoning import Fact, InferenceEngine


def test_add_fact():
    engine = InferenceEngine()

    fact = engine.add_fact(
        "Quavron",
        "type",
        "platform",
    )

    assert isinstance(fact, Fact)
    assert fact.subject == "Quavron"
    assert fact.predicate == "type"
    assert fact.value == "platform"


def test_rule_derives_fact():
    engine = InferenceEngine()

    engine.add_rule(
        "platform_rule",
        lambda context: context.get("type") == "platform",
        lambda context: Fact(
            "Quavron",
            "category",
            "technology",
        ),
    )

    result = engine.infer({
        "type": "platform",
    })

    assert result["success"] is True
    assert len(result["facts"]) == 1
    assert result["facts"][0].value == "technology"


def test_duplicate_fact_is_not_added():
    engine = InferenceEngine()

    engine.add_fact("Quavron", "type", "platform")
    engine.add_fact("Quavron", "type", "platform")

    assert len(engine.facts()) == 1


def test_no_matching_rule():
    engine = InferenceEngine()

    engine.add_rule(
        "platform_rule",
        lambda context: context.get("type") == "platform",
        lambda context: Fact(
            "Quavron",
            "category",
            "technology",
        ),
    )

    result = engine.infer({
        "type": "company",
    })

    assert result["success"] is True
    assert result["facts"] == []


def test_multi_step_reasoning():
    engine = InferenceEngine()

    engine.add_rule(
        "platform_to_technology",
        lambda context: context.get("type") == "platform",
        lambda context: Fact(
            "Quavron",
            "category",
            "technology",
        ),
    )

    engine.add_rule(
        "technology_to_digital",
        lambda context: context.get("category") == "technology",
        lambda context: Fact(
            "Quavron",
            "domain",
            "digital",
        ),
    )

    result = engine.infer({
        "type": "platform",
    })

    values = [fact.value for fact in result["facts"]]

    assert "technology" in values
    assert "digital" in values

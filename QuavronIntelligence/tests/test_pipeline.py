from quavron_intelligence import (
    IntelligenceEngine,
    IntelligenceCoordinator,
    IntentEngine,
)
from quavron_intelligence.pipeline import IntelligencePipeline


def make_pipeline():
    engine = IntelligenceEngine()
    coordinator = IntelligenceCoordinator(engine)
    intent = IntentEngine()

    return IntelligencePipeline(
        coordinator,
        intent,
    )


def test_pipeline_knowledge():
    pipeline = make_pipeline()

    result = pipeline.process(
        "ما هي Quavron؟"
    )

    assert result["success"] is True
    assert result["intent"] == "knowledge"
    assert result["route"] == "knowledge"
    assert result["action"] == "recall"


def test_pipeline_reasoning():
    pipeline = make_pipeline()

    result = pipeline.process(
        "لماذا Quavron منصة؟"
    )

    assert result["intent"] == "reasoning"
    assert result["route"] == "reasoning"
    assert result["action"] == "reason"


def test_pipeline_learning():
    pipeline = make_pipeline()

    result = pipeline.process(
        "احفظ هذه المعلومة"
    )

    assert result["intent"] == "learn"
    assert result["route"] == "memory"


def test_pipeline_greeting():
    pipeline = make_pipeline()

    result = pipeline.process(
        "مرحبا يا QAI"
    )

    assert result["intent"] == "greeting"
    assert result["route"] == "conversation"


def test_pipeline_unknown():
    pipeline = make_pipeline()

    result = pipeline.process(
        "xyz"
    )

    assert result["intent"] == "unknown"
    assert result["route"] == "unknown"

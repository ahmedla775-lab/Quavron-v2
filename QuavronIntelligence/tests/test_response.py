from quavron_intelligence.response import ResponseEngine


def test_greeting_response():
    engine = ResponseEngine()

    result = engine.build({
        "intent": "greeting",
        "route": "conversation",
    })

    assert result["success"] is True
    assert result["content"] == "مرحبًا! أنا QAI."
    assert result["metadata"]["source"] == "local"


def test_knowledge_response():
    engine = ResponseEngine()

    result = engine.build({
        "intent": "knowledge",
        "route": "knowledge",
        "knowledge": "Next Generation Platform",
    })

    assert result["content"] == "Next Generation Platform"
    assert result["metadata"]["source"] == "knowledge"


def test_reasoning_response():
    engine = ResponseEngine()

    reasoning = {
        "success": True,
        "results": ["Quavron is a platform"],
        "rules_evaluated": 1,
    }

    result = engine.build({
        "intent": "reasoning",
        "route": "reasoning",
        "reasoning": reasoning,
    })

    assert result["content"] == reasoning
    assert result["metadata"]["source"] == "reasoning"


def test_unknown_response():
    engine = ResponseEngine()

    result = engine.build({
        "intent": "unknown",
        "route": "unknown",
    })

    assert "لا أملك" in result["content"]
    assert result["metadata"]["source"] == "unknown"


def test_invalid_input():
    engine = ResponseEngine()

    try:
        engine.build("invalid")
        assert False
    except TypeError:
        assert True

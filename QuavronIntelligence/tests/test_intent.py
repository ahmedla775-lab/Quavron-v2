from quavron_intelligence.intent import IntentEngine


def test_greeting_intent():
    result = IntentEngine().detect("مرحبا")
    assert result.intent == "greeting"
    assert result.confidence > 0


def test_knowledge_intent():
    result = IntentEngine().detect("ما هي Quavron؟")
    assert result.intent == "knowledge"


def test_help_intent():
    result = IntentEngine().detect("ساعدني في البرمجة")
    assert result.intent == "help"


def test_learn_intent():
    result = IntentEngine().detect("احفظ هذه المعلومة")
    assert result.intent == "learn"


def test_reasoning_intent():
    result = IntentEngine().detect("لماذا Quavron منصة؟")
    assert result.intent == "reasoning"


def test_unknown_intent():
    result = IntentEngine().detect("xyz")
    assert result.intent == "unknown"

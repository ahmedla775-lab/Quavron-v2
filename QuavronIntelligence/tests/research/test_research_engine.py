from quavron_intelligence.research import (
    ResearchEngine,
    ResearchRequest,
)


def test_research_engine_initializes():
    engine = ResearchEngine()

    assert engine is not None


def test_empty_research_query():
    engine = ResearchEngine()

    result = engine.research_text("")

    assert result.success is False
    assert result.metadata["reason"] == "empty_query"


def test_research_request():
    engine = ResearchEngine()

    result = engine.research_text(
        "اختبار الرياضيات بكالوريا 2024 علوم تجريبية"
    )

    assert result.success is True
    assert result.query == "اختبار الرياضيات بكالوريا 2024 علوم تجريبية"
    assert result.metadata["external_ai_required"] is False


def test_research_requires_request():
    engine = ResearchEngine()

    try:
        engine.research("test")
        assert False
    except TypeError:
        assert True

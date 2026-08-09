from quavron_intelligence.knowledge.research_adapter import (
    ResearchKnowledgeAdapter,
)
from quavron_intelligence.research.models import (
    Evidence,
    KnowledgeItem,
)


def make_item():
    evidence = Evidence(
        statement="Mathematics is the study of patterns and structures.",
        source_url="https://example.com/math",
        confidence=0.7,
        context="Mathematics is the study of patterns and structures.",
    )

    return KnowledgeItem(
        subject="Mathematics",
        statement="Mathematics is the study of patterns and structures.",
        knowledge_type="web_fact",
        confidence=0.7,
        sources=["https://example.com/math"],
        evidence=[evidence],
        metadata={
            "topic": "mathematics",
        },
    )


def test_adapter_converts_research_item():
    adapter = ResearchKnowledgeAdapter()

    result = adapter.adapt(make_item())

    assert result["type"] == "web_fact"
    assert result["item_type"] == "web_fact"
    assert result["value"] == (
        "Mathematics is the study of patterns and structures."
    )
    assert result["subject"] == "Mathematics"
    assert result["source"] == "research"
    assert result["confidence"] == 0.7
    assert result["sources"] == [
        "https://example.com/math"
    ]
    assert result["metadata"]["research"] is True
    assert result["metadata"]["topic"] == "mathematics"


def test_adapter_preserves_evidence():
    adapter = ResearchKnowledgeAdapter()

    result = adapter.adapt(make_item())

    assert len(result["evidence"]) == 1
    assert result["evidence"][0]["source_url"] == (
        "https://example.com/math"
    )


def test_adapter_many():
    adapter = ResearchKnowledgeAdapter()

    items = [
        make_item(),
        make_item(),
    ]

    result = adapter.adapt_many(items)

    assert len(result) == 2
    assert all(
        item["source"] == "research"
        for item in result
    )


def test_adapter_rejects_wrong_type():
    adapter = ResearchKnowledgeAdapter()

    try:
        adapter.adapt({"statement": "invalid"})
        assert False
    except TypeError:
        assert True

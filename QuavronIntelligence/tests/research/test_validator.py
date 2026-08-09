from quavron_intelligence.research.models import (
    KnowledgeItem,
    ResearchSource,
)
from quavron_intelligence.research.validator import (
    ResearchValidator,
)


def make_item(
    statement="Mathematics is the study of patterns and structures.",
    confidence=0.7,
    sources=None,
):
    return KnowledgeItem(
        subject="mathematics",
        statement=statement,
        knowledge_type="web_fact",
        confidence=confidence,
        sources=(
            ["https://example.com/"]
            if sources is None
            else sources
        ),
    )


def test_validator_accepts_valid_knowledge():
    validator = ResearchValidator()

    result = validator.validate(
        make_item()
    )

    assert result.accepted is True
    assert result.reason == "accepted"
    assert result.confidence == 0.7


def test_validator_rejects_empty_statement():
    validator = ResearchValidator()

    result = validator.validate(
        make_item(statement="")
    )

    assert result.accepted is False
    assert result.reason == "empty_statement"


def test_validator_rejects_short_statement():
    validator = ResearchValidator()

    result = validator.validate(
        make_item(statement="Too short")
    )

    assert result.accepted is False
    assert result.reason == "statement_too_short"


def test_validator_rejects_low_confidence():
    validator = ResearchValidator()

    result = validator.validate(
        make_item(confidence=0.2)
    )

    assert result.accepted is False
    assert result.reason == "low_confidence"


def test_validator_rejects_missing_source():
    validator = ResearchValidator()

    result = validator.validate(
        make_item(sources=[])
    )

    assert result.accepted is False
    assert result.reason == "missing_source"


def test_validator_rejects_invalid_source():
    validator = ResearchValidator()

    result = validator.validate(
        make_item(
            sources=["not-a-url"]
        )
    )

    assert result.accepted is False
    assert result.reason == "invalid_source"


def test_validator_uses_source_when_item_has_no_source():
    validator = ResearchValidator()

    item = make_item(sources=[])

    source = ResearchSource(
        url="https://example.com/",
        title="Mathematics",
        source_type="web",
        domain="example.com",
        content=item.statement,
    )

    result = validator.validate(
        item,
        source=source,
    )

    assert result.accepted is True
    assert result.metadata["source_count"] == 1


def test_validator_clamps_confidence():
    validator = ResearchValidator()

    high = validator.validate(
        make_item(confidence=9.0)
    )

    low = validator.validate(
        make_item(confidence=-4.0)
    )

    assert high.confidence == 1.0
    assert low.confidence == 0.0

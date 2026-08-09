from typing import Any

from quavron_data import DataSchema


def test_schema_accepts_valid_data():
    schema = DataSchema({
        "name": str,
        "age": int,
    })

    result = schema.validate({
        "name": "Quavron",
        "age": 1,
    })

    assert result["valid"] is True
    assert result["errors"] == []


def test_schema_detects_missing_field():
    schema = DataSchema({
        "name": str,
        "age": int,
    })

    result = schema.validate({
        "name": "Quavron",
    })

    assert result["valid"] is False
    assert "Missing required field: age" in result["errors"]


def test_schema_detects_invalid_type():
    schema = DataSchema({
        "name": str,
        "age": int,
    })

    result = schema.validate({
        "name": "Quavron",
        "age": "one",
    })

    assert result["valid"] is False
    assert any(
        "Invalid type for age" in error
        for error in result["errors"]
    )


def test_schema_supports_any_type():
    schema = DataSchema({
        "value": Any,
    })

    result = schema.validate({
        "value": {
            "anything": True,
        },
    })

    assert result["valid"] is True


def test_schema_returns_fields():
    schema = DataSchema({
        "name": str,
        "age": int,
    })

    assert schema.fields_list() == ["name", "age"]

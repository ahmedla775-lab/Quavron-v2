from quavron_data import DataValidator


def test_validate_object():
    result = DataValidator().validate({
        "name": "Quavron",
        "type": "platform",
    })

    assert result.valid is True
    assert result.data_type == "object"
    assert result.errors == []


def test_validate_empty_string():
    result = DataValidator().validate("")

    assert result.valid is True
    assert "String is empty or contains only whitespace" in result.warnings


def test_validate_empty_list():
    result = DataValidator().validate([])

    assert result.valid is True
    assert "Collection is empty" in result.warnings


def test_validate_none():
    result = DataValidator().validate(None)

    assert result.valid is True
    assert result.data_type == "null"

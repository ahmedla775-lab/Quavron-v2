from quavron_data import DataTypeDetector


def test_detect_object():
    result = DataTypeDetector().detect({
        "name": "Quavron",
        "type": "platform",
    })

    assert result.data_type == "object"
    assert result.confidence == 1.0
    assert result.metadata["key_count"] == 2


def test_detect_string():
    result = DataTypeDetector().detect("Quavron")

    assert result.data_type == "string"
    assert result.metadata["length"] == 7
    assert result.metadata["empty"] is False


def test_detect_integer():
    result = DataTypeDetector().detect(42)

    assert result.data_type == "integer"


def test_detect_list():
    result = DataTypeDetector().detect([1, 2, 3])

    assert result.data_type == "list"
    assert result.metadata["length"] == 3

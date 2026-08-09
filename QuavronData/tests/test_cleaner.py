from quavron_data import DataCleaner


def test_cleaner_removes_extra_spaces():
    cleaner = DataCleaner()

    result = cleaner.clean({
        "name": "   Quavron   AI   ",
        "description": "Next   Generation   Platform",
    })

    assert result["name"] == "Quavron AI"
    assert result["description"] == "Next Generation Platform"


def test_cleaner_handles_nested_data():
    cleaner = DataCleaner()

    result = cleaner.clean({
        "user": {
            "name": "   Ahmed   ",
        },
        "tags": [
            "   AI   ",
            "   Quavron   ",
        ],
    })

    assert result["user"]["name"] == "Ahmed"
    assert result["tags"] == ["AI", "Quavron"]


def test_cleaner_preserves_non_string_values():
    cleaner = DataCleaner()

    result = cleaner.clean({
        "age": 31,
        "active": True,
        "score": 99.5,
    })

    assert result["age"] == 31
    assert result["active"] is True
    assert result["score"] == 99.5

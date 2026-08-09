from quavron_data import DataNormalizer


def test_normalizer_normalizes_keys():
    normalizer = DataNormalizer()

    result = normalizer.normalize({
        " First Name ": " Ahmed ",
        "User Name": " Quavron ",
    })

    assert result["first_name"] == "Ahmed"
    assert result["user_name"] == "Quavron"


def test_normalizer_preserves_arabic_keys():
    normalizer = DataNormalizer()

    result = normalizer.normalize({
        " اسم المستخدم ": " أحمد ",
    })

    assert result["اسم_المستخدم"] == "أحمد"


def test_normalizer_handles_nested_data():
    normalizer = DataNormalizer()

    result = normalizer.normalize({
        "User Data": {
            "Full Name": " Ahmed ",
        },
        "Tags": [
            " AI ",
            " Quavron ",
        ],
    })

    assert result["user_data"]["full_name"] == "Ahmed"
    assert result["tags"] == ["AI", "Quavron"]


def test_normalizer_preserves_types():
    normalizer = DataNormalizer()

    result = normalizer.normalize({
        "Age": 31,
        "Active": True,
        "Score": 99.5,
        "Value": None,
    })

    assert result["age"] == 31
    assert result["active"] is True
    assert result["score"] == 99.5
    assert result["value"] is None

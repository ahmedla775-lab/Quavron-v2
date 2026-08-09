from quavron_data import QuavronData


def test_public_api_process():
    qai = QuavronData()

    result = qai.process(
        {
            "name": "Quavron",
            "type": "platform",
        }
    )

    assert result.success is True


def test_public_api_search():
    qai = QuavronData()

    qai.add(
        "quavron",
        {
            "name": "Quavron",
            "description": "next generation platform",
        },
    )

    results = qai.find("Quavron")

    assert results
    assert results[0]["id"] == "quavron"


def test_public_api_crud():
    qai = QuavronData()

    qai.add(
        "1",
        {
            "name": "QAI",
        },
    )

    assert qai.count() == 1
    assert qai.get("1")["name"] == "QAI"

    assert qai.remove("1") is True
    assert qai.count() == 0

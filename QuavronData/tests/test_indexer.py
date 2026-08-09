from quavron_data import DataIndexer


def test_indexer_add_and_get():
    indexer = DataIndexer()

    result = indexer.add(
        "1",
        {
            "name": "Quavron",
            "type": "platform",
        },
    )

    assert result["success"] is True
    assert indexer.get("1")["name"] == "Quavron"
    assert indexer.count() == 1


def test_indexer_search():
    indexer = DataIndexer()

    indexer.add(
        "1",
        {
            "name": "Quavron",
            "description": "next generation platform",
        },
    )

    indexer.add(
        "2",
        {
            "name": "QAI",
            "description": "intelligent assistant",
        },
    )

    results = indexer.search("Quavron")

    assert results
    assert results[0]["id"] == "1"


def test_indexer_remove():
    indexer = DataIndexer()

    indexer.add(
        "1",
        {
            "name": "Quavron",
        },
    )

    assert indexer.remove("1") is True
    assert indexer.get("1") is None
    assert indexer.count() == 0


def test_indexer_add_many():
    indexer = DataIndexer()

    result = indexer.add_many(
        [
            {"id": "1", "name": "Quavron"},
            {"id": "2", "name": "QAI"},
        ]
    )

    assert result["count"] == 2
    assert indexer.count() == 2

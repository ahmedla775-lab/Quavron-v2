from quavron_data import DataIndex


def test_index_add_and_get():
    index = DataIndex()

    entry = index.add(
        "quavron",
        {
            "name": "Quavron",
            "type": "platform",
        },
    )

    assert entry.key == "quavron"
    assert index.exists("quavron")

    result = index.get("quavron")

    assert result is not None
    assert result.data["name"] == "Quavron"


def test_index_search():
    index = DataIndex()

    index.add(
        "quavron",
        "Quavron is a next generation platform",
    )

    index.add(
        "qai",
        "QAI is the intelligent assistant",
    )

    results = index.search("next generation")

    assert len(results) == 1
    assert results[0].key == "quavron"


def test_index_search_metadata():
    index = DataIndex()

    index.add(
        "qai",
        "Intelligent assistant",
        metadata={
            "category": "artificial intelligence",
        },
    )

    results = index.search("artificial intelligence")

    assert len(results) == 1
    assert results[0].key == "qai"


def test_index_remove():
    index = DataIndex()

    index.add("test", "value")

    assert index.exists("test")
    assert index.remove("test") is True
    assert not index.exists("test")
    assert index.remove("test") is False


def test_index_stats():
    index = DataIndex()

    index.add("one", 1)
    index.add("two", 2)

    stats = index.stats()

    assert stats["entries"] == 2
    assert stats["engine"] == "Quavron Data Index"
    assert stats["version"] == "0.1.0"


def test_index_clear():
    index = DataIndex()

    index.add("one", 1)
    index.add("two", 2)

    index.clear()

    assert index.count() == 0
    assert index.all() == []

from quavron_data import DataSearch


def test_search_ranks_name_above_description():
    search = DataSearch()

    search.add(
        "quavron",
        {
            "name": "Quavron",
            "description": "next generation platform",
        },
    )

    search.add(
        "qai",
        {
            "name": "QAI",
            "description": "intelligent assistant of Quavron",
        },
    )

    results = search.search("Quavron")

    assert results
    assert results[0]["id"] == "quavron"


def test_search_returns_empty_for_empty_query():
    search = DataSearch()

    search.add(
        "1",
        {
            "name": "Quavron",
        },
    )

    assert search.search("") == []
    assert search.search("   ") == []


def test_search_respects_limit():
    search = DataSearch()

    search.add_many(
        [
            {"id": "1", "name": "Quavron"},
            {"id": "2", "name": "Quavron AI"},
            {"id": "3", "name": "Quavron Platform"},
        ]
    )

    results = search.search("Quavron", limit=2)

    assert len(results) == 2


def test_search_reports_matched_fields():
    search = DataSearch()

    search.add(
        "qai",
        {
            "name": "QAI",
            "description": "intelligent assistant",
        },
    )

    results = search.search("QAI")

    assert results
    assert "name" in results[0]["matched_fields"]


def test_search_get_and_remove():
    search = DataSearch()

    search.add(
        "1",
        {
            "name": "Quavron",
        },
    )

    assert search.get("1")["name"] == "Quavron"
    assert search.remove("1") is True
    assert search.get("1") is None


def test_search_clear():
    search = DataSearch()

    search.add(
        "1",
        {
            "name": "Quavron",
        },
    )

    search.clear()

    assert search.count() == 0
    assert search.search("Quavron") == []

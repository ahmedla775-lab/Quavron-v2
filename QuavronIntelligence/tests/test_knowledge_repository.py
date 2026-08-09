from quavron_intelligence.knowledge.repository import KnowledgeRepository


def make_repository():
    repository = KnowledgeRepository()

    repository.add_many(
        [
            {
                "type": "concept",
                "key": "company.name",
                "value": "Quavron",
            },
            {
                "type": "fact",
                "key": "company.description",
                "value": "Quavron is a next generation digital platform.",
            },
            {
                "type": "feature",
                "key": "feature.cloud_ide",
                "value": "Quavron Cloud IDE is a development environment.",
            },
            {
                "type": "feature",
                "key": "feature.qai",
                "value": "QAI is the intelligent assistant of Quavron.",
            },
        ]
    )

    return repository


def test_repository_add():
    repository = KnowledgeRepository()

    repository.add(
        {
            "type": "concept",
            "key": "company.name",
            "value": "Quavron",
        }
    )

    assert repository.count() == 1


def test_repository_add_many():
    repository = make_repository()

    assert repository.count() == 4


def test_repository_all():
    repository = make_repository()

    items = repository.all()

    assert len(items) == 4
    assert items[0]["key"] == "company.name"


def test_repository_search():
    repository = make_repository()

    results = repository.search("Quavron")

    assert results
    assert results[0]["item"]["key"] in {
        "company.description",
        "company.name",
        "feature.qai",
        "feature.cloud_ide",
    }


def test_repository_find():
    repository = make_repository()

    result = repository.find("Cloud IDE")

    assert result is not None
    assert result["key"] == "feature.cloud_ide"


def test_repository_unknown():
    repository = make_repository()

    assert repository.find("Japan") is None


def test_repository_clear():
    repository = make_repository()

    repository.clear()

    assert repository.count() == 0

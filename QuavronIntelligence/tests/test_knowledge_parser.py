from quavron_intelligence import KnowledgeBuilder
from quavron_intelligence.knowledge_parser import (
    KnowledgeItem,
    KnowledgeParser,
)


def test_parser_returns_knowledge_items():
    builder = KnowledgeBuilder("knowledge/quavron")
    documents = builder.build()

    parser = KnowledgeParser()

    items = parser.parse_many(documents)

    assert items
    assert all(
        isinstance(item, KnowledgeItem)
        for item in items
    )


def test_parser_extracts_qai_feature():
    builder = KnowledgeBuilder("knowledge/quavron")
    documents = builder.build()

    document = next(
        item
        for item in documents
        if item.document_id == "features/qai"
    )

    parser = KnowledgeParser()
    items = parser.parse(document)

    assert len(items) == 1
    assert items[0].item_type == "feature"
    assert items[0].key == "feature.qai"
    assert "intelligent assistant" in items[0].value


def test_parser_extracts_faq():
    builder = KnowledgeBuilder("knowledge/quavron")
    documents = builder.build()

    document = next(
        item
        for item in documents
        if item.document_id == "faq/general"
    )

    parser = KnowledgeParser()
    items = parser.parse(document)

    assert len(items) == 3
    assert all(item.item_type == "faq" for item in items)

    assert items[0].metadata["question"] == "What is Quavron?"


def test_parser_extracts_company():
    builder = KnowledgeBuilder("knowledge/quavron")
    documents = builder.build()

    document = next(
        item
        for item in documents
        if item.document_id == "company/identity"
    )

    parser = KnowledgeParser()
    items = parser.parse(document)

    assert len(items) == 2
    assert items[0].key == "company.name"
    assert items[0].value == "Quavron"


def test_parser_preserves_source():
    builder = KnowledgeBuilder("knowledge/quavron")
    documents = builder.build()

    parser = KnowledgeParser()
    items = parser.parse_many(documents)

    assert all(item.source for item in items)

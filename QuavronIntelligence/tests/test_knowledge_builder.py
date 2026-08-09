from pathlib import Path

from quavron_intelligence.knowledge_builder import (
    KnowledgeBuilder,
    KnowledgeDocument,
)


def test_builder_reads_quavron_knowledge():
    root = Path("knowledge/quavron")

    builder = KnowledgeBuilder(root)

    documents = builder.build()

    assert documents
    assert all(
        isinstance(document, KnowledgeDocument)
        for document in documents
    )


def test_builder_reads_expected_feature():
    builder = KnowledgeBuilder("knowledge/quavron")

    documents = builder.build()

    qai = [
        document
        for document in documents
        if document.document_id == "features/qai"
    ]

    assert len(qai) == 1
    assert qai[0].category == "features"
    assert "intelligent assistant" in qai[0].content


def test_builder_does_not_read_python_files(tmp_path):
    root = tmp_path / "knowledge"
    root.mkdir()

    (root / "valid.md").write_text(
        "# Valid\nQuavron platform",
        encoding="utf-8",
    )

    (root / "secret.py").write_text(
        "print('should not be read')",
        encoding="utf-8",
    )

    builder = KnowledgeBuilder(root)

    documents = builder.build()

    assert len(documents) == 1
    assert documents[0].name == "valid"


def test_builder_rejects_missing_root(tmp_path):
    missing = tmp_path / "does-not-exist"

    builder = KnowledgeBuilder(missing)

    try:
        builder.build()
        assert False
    except FileNotFoundError:
        assert True

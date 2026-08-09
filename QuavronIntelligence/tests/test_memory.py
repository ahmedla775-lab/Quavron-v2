import pytest

from quavron_intelligence import MemoryCore


def test_remember_and_recall():
    memory = MemoryCore()

    item = memory.remember(
        "quavron.type",
        "platform",
    )

    assert item.key == "quavron.type"
    assert item.value == "platform"
    assert item.memory_type == "fact"

    recalled = memory.recall("quavron.type")

    assert recalled is not None
    assert recalled.value == "platform"


def test_memory_types():
    memory = MemoryCore()

    memory.remember(
        "qai.role",
        "intelligence",
        memory_type="concept",
    )

    memory.remember(
        "user.language",
        "English",
        memory_type="preference",
    )

    assert len(memory.find("concept")) == 1
    assert len(memory.find("preference")) == 1


def test_confidence_is_bounded():
    memory = MemoryCore()

    high = memory.remember(
        "high",
        True,
        confidence=5,
    )

    low = memory.remember(
        "low",
        False,
        confidence=-2,
    )

    assert high.confidence == 1.0
    assert low.confidence == 0.0


def test_overwrite_memory():
    memory = MemoryCore()

    memory.remember(
        "quavron.type",
        "website",
    )

    memory.remember(
        "quavron.type",
        "platform",
    )

    assert memory.count() == 1
    assert memory.recall("quavron.type").value == "platform"


def test_forget():
    memory = MemoryCore()

    memory.remember(
        "temporary",
        "value",
        memory_type="context",
    )

    assert memory.forget("temporary") is True
    assert memory.recall("temporary") is None
    assert memory.forget("temporary") is False


def test_invalid_memory_type():
    memory = MemoryCore()

    with pytest.raises(ValueError):
        memory.remember(
            "test",
            "value",
            memory_type="unknown",
        )

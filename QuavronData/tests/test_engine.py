from quavron_data import DataEngine


def test_engine_process():
    engine = DataEngine()

    result = engine.process(
        {
            "name": "Quavron",
            "type": "platform",
        }
    )

    assert result.success is True
    assert result.data["name"] == "Quavron"
    assert result.metadata["engine"] == "Quavron Data Engine"
    assert result.metadata["version"] == "0.1.0"

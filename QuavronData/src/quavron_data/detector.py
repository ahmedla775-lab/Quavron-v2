from typing import Any

from .types import DetectionResult


class DataTypeDetector:
    """
    Detects the structural type of incoming data.

    The detector intentionally focuses on structure rather than
    domain-specific meaning. Semantic interpretation will be handled
    by higher-level Quavron engines later.
    """

    def detect(self, data: Any) -> DetectionResult:
        if data is None:
            return DetectionResult(
                data_type="null",
                confidence=1.0,
            )

        if isinstance(data, bool):
            return DetectionResult(
                data_type="boolean",
                confidence=1.0,
            )

        if isinstance(data, int) and not isinstance(data, bool):
            return DetectionResult(
                data_type="integer",
                confidence=1.0,
            )

        if isinstance(data, float):
            return DetectionResult(
                data_type="float",
                confidence=1.0,
            )

        if isinstance(data, str):
            return DetectionResult(
                data_type="string",
                confidence=1.0,
                metadata={
                    "length": len(data),
                    "empty": not bool(data.strip()),
                },
            )

        if isinstance(data, list):
            return DetectionResult(
                data_type="list",
                confidence=1.0,
                metadata={
                    "length": len(data),
                },
            )

        if isinstance(data, tuple):
            return DetectionResult(
                data_type="tuple",
                confidence=1.0,
                metadata={
                    "length": len(data),
                },
            )

        if isinstance(data, dict):
            return DetectionResult(
                data_type="object",
                confidence=1.0,
                metadata={
                    "keys": list(data.keys()),
                    "key_count": len(data),
                },
            )

        return DetectionResult(
            data_type="unknown",
            confidence=0.0,
            metadata={
                "python_type": type(data).__name__,
            },
        )

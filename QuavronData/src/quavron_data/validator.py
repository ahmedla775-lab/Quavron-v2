from typing import Any, Optional

from .detector import DataTypeDetector
from .types import ValidationResult


class DataValidator:
    """
    Validates incoming data at the structural level.

    This layer does not attempt to determine whether the content is
    factually correct. Its responsibility is data integrity.
    """

    SUPPORTED_TYPES = {
        "null",
        "boolean",
        "integer",
        "float",
        "string",
        "list",
        "tuple",
        "object",
    }

    def __init__(self, detector: Optional[DataTypeDetector] = None):
        self.detector = detector or DataTypeDetector()

    def validate(self, data: Any) -> ValidationResult:
        detection = self.detector.detect(data)
        errors = []
        warnings = []

        if detection.data_type not in self.SUPPORTED_TYPES:
            errors.append(
                f"Unsupported data type: {detection.data_type}"
            )

        if detection.data_type == "string" and detection.metadata.get("empty"):
            warnings.append("String is empty or contains only whitespace")

        if detection.data_type in {"list", "tuple"}:
            if detection.metadata.get("length", 0) == 0:
                warnings.append("Collection is empty")

        if detection.data_type == "object":
            if detection.metadata.get("key_count", 0) == 0:
                warnings.append("Object contains no fields")

        return ValidationResult(
            valid=not errors,
            data_type=detection.data_type,
            errors=errors,
            warnings=warnings,
            metadata=detection.metadata,
        )

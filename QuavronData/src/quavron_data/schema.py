from typing import Any, Dict, List


class DataSchema:
    """
    Lightweight schema definition and validation.

    Example:
        schema = DataSchema({
            "name": str,
            "age": int,
        })
    """

    def __init__(self, fields: Dict[str, Any]):
        if not isinstance(fields, dict):
            raise TypeError("Schema fields must be a dictionary")

        self.fields = dict(fields)

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            return {
                "valid": False,
                "errors": ["Data must be a dictionary"],
            }

        errors: List[str] = []

        for field_name, expected_type in self.fields.items():
            if field_name not in data:
                errors.append(f"Missing required field: {field_name}")
                continue

            value = data[field_name]

            if expected_type is not Any and not isinstance(
                value,
                expected_type,
            ):
                errors.append(
                    f"Invalid type for {field_name}: "
                    f"expected {expected_type.__name__}, "
                    f"got {type(value).__name__}"
                )

        return {
            "valid": not errors,
            "errors": errors,
        }

    def fields_list(self) -> List[str]:
        return list(self.fields.keys())

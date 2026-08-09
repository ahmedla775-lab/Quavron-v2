from typing import Any, Dict


class DataCleaner:
    """
    Cleans common data quality problems without changing
    the semantic meaning of the input.
    """

    def clean(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            raise TypeError("DataCleaner expects a dictionary")

        return {
            key: self._clean_value(value)
            for key, value in data.items()
        }

    def _clean_value(self, value: Any) -> Any:
        if isinstance(value, str):
            return " ".join(value.strip().split())

        if isinstance(value, dict):
            return {
                key: self._clean_value(item)
                for key, item in value.items()
            }

        if isinstance(value, list):
            return [
                self._clean_value(item)
                for item in value
            ]

        return value

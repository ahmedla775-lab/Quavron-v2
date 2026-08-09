import re
from typing import Any, Dict


class DataNormalizer:
    """
    Normalizes structured data into a predictable representation
    while preserving its semantic meaning.
    """

    def normalize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            raise TypeError("DataNormalizer expects a dictionary")

        return {
            self._normalize_key(key): self._normalize_value(value)
            for key, value in data.items()
        }

    def _normalize_key(self, key: Any) -> str:
        key = str(key).strip().lower()
        key = re.sub(r"\s+", "_", key)
        key = re.sub(r"[^a-z0-9_\u0600-\u06ff]", "", key)
        key = re.sub(r"_+", "_", key)

        return key.strip("_")

    def _normalize_value(self, value: Any) -> Any:
        if isinstance(value, str):
            return " ".join(value.strip().split())

        if isinstance(value, dict):
            return {
                self._normalize_key(key): self._normalize_value(item)
                for key, item in value.items()
            }

        if isinstance(value, list):
            return [
                self._normalize_value(item)
                for item in value
            ]

        return value

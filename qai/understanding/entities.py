from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


# ---------------------------------------------------------------------------
# Entity types
# ---------------------------------------------------------------------------

ENTITY_PERSON = "person"
ENTITY_ORGANIZATION = "organization"
ENTITY_COMPANY = "company"
ENTITY_PRODUCT = "product"
ENTITY_PLATFORM = "platform"
ENTITY_COUNTRY = "country"
ENTITY_CITY = "city"
ENTITY_LOCATION = "location"
ENTITY_LANGUAGE = "language"
ENTITY_TECHNOLOGY = "technology"
ENTITY_PROJECT = "project"
ENTITY_CONCEPT = "concept"
ENTITY_DATE = "date"
ENTITY_NUMBER = "number"
ENTITY_UNKNOWN = "unknown"


KNOWN_COUNTRIES = {
    "الجزائر",
    "الجزائرية",
    "مصر",
    "المغرب",
    "تونس",
    "ليبيا",
    "موريتانيا",
    "فرنسا",
    "ألمانيا",
    "إسبانيا",
    "إيطاليا",
    "بريطانيا",
    "المملكة المتحدة",
    "الولايات المتحدة",
    "امريكا",
    "أمريكا",
    "كندا",
    "روسيا",
    "الصين",
    "اليابان",
    "الهند",
    "تركيا",
    "قطر",
    "السعودية",
    "الإمارات",
    "الأردن",
    "لبنان",
    "العراق",
    "فلسطين",
    "سوريا",
}

KNOWN_CITIES = {
    "الجزائر",
    "الجزائر العاصمة",
    "الجلفة",
    "وهران",
    "قسنطينة",
    "عنابة",
    "سطيف",
    "البليدة",
    "باتنة",
    "بسكرة",
    "تونس",
    "الرباط",
    "الدار البيضاء",
    "مراكش",
    "القاهرة",
    "الإسكندرية",
    "باريس",
    "لندن",
    "برلين",
    "روما",
    "مدريد",
    "موسكو",
    "نيويورك",
    "لوس أنجلوس",
    "طوكيو",
    "بكين",
}

KNOWN_LANGUAGES = {
    "العربية",
    "عربي",
    "اللغة العربية",
    "الفرنسية",
    "فرنسي",
    "اللغة الفرنسية",
    "الإنجليزية",
    "انجليزية",
    "إنجليزي",
    "اللغة الإنجليزية",
    "english",
    "french",
    "arabic",
    "german",
    "الألمانية",
    "ألماني",
    "الروسية",
    "الروسية",
    "russian",
    "spanish",
    "الإسبانية",
    "التركية",
    "turkish",
}

KNOWN_TECHNOLOGIES = {
    "python",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "vite",
    "node.js",
    "nodejs",
    "java",
    "c++",
    "c#",
    "html",
    "css",
    "tailwind",
    "tailwind css",
    "firebase",
    "vercel",
    "capacitor",
    "gradle",
    "git",
    "github",
    "docker",
    "linux",
    "android",
    "llama.cpp",
    "rag",
    "llm",
    "api",
}

KNOWN_PLATFORMS = {
    "quavron",
    "quavron ai",
    "qai",
    "github",
    "firebase",
    "vercel",
    "youtube",
    "facebook",
    "instagram",
    "reddit",
    "tiktok",
    "linkedin",
    "x",
}

KNOWN_PROJECTS = {
    "quavron",
    "quavronv2",
    "qai",
    "qce",
    "mailorganizer",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _text(value: Any) -> str:
    return str(value or "").strip()


def _normalize(value: Any) -> str:
    return " ".join(_text(value).casefold().split())


def _unique_preserve(values: Iterable[str]) -> List[str]:
    seen = set()
    result: List[str] = []

    for value in values:
        key = _normalize(value)

        if not key or key in seen:
            continue

        seen.add(key)
        result.append(value)

    return result


def _safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# ---------------------------------------------------------------------------
# Entity object
# ---------------------------------------------------------------------------

@dataclass
class Entity:
    """
    Stable representation of one extracted entity.

    The object intentionally contains only understanding information.
    It does not perform retrieval or reasoning.
    """

    text: str
    entity_type: str = ENTITY_UNKNOWN

    normalized: str = ""

    start: Optional[int] = None
    end: Optional[int] = None

    confidence: float = 0.0

    source: str = "understanding"
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.text = _text(self.text)

        if not self.normalized:
            self.normalized = _normalize(self.text)

        self.entity_type = (
            _text(self.entity_type)
            or ENTITY_UNKNOWN
        )

        self.confidence = max(
            0.0,
            min(1.0, _safe_float(self.confidence)),
        )

        self.metadata = dict(self.metadata or {})

    @property
    def label(self) -> str:
        return self.entity_type

    @property
    def value(self) -> str:
        return self.text

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "type": self.entity_type,
            "entity_type": self.entity_type,
            "normalized": self.normalized,
            "start": self.start,
            "end": self.end,
            "confidence": self.confidence,
            "source": self.source,
            "metadata": dict(self.metadata),
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Entity":
        if not isinstance(data, dict):
            return cls("")

        return cls(
            text=data.get("text", data.get("value", "")),
            entity_type=data.get(
                "entity_type",
                data.get("type", ENTITY_UNKNOWN),
            ),
            normalized=data.get("normalized", ""),
            start=data.get("start"),
            end=data.get("end"),
            confidence=data.get("confidence", 0.0),
            source=data.get("source", "understanding"),
            metadata=data.get("metadata", {}),
        )


# ---------------------------------------------------------------------------
# Entity extraction
# ---------------------------------------------------------------------------

class EntityExtractor:
    """
    Conservative deterministic entity extractor.

    The extractor combines:
      1. known-domain dictionaries,
      2. explicit user-provided entity hints,
      3. lightweight pattern extraction.

    It deliberately avoids pretending to be a full NER model.
    """

    def __init__(
        self,
        *,
        countries: Optional[Iterable[str]] = None,
        cities: Optional[Iterable[str]] = None,
        languages: Optional[Iterable[str]] = None,
        technologies: Optional[Iterable[str]] = None,
        platforms: Optional[Iterable[str]] = None,
        projects: Optional[Iterable[str]] = None,
    ) -> None:

        self.countries = set(
            _normalize(x)
            for x in (countries or KNOWN_COUNTRIES)
        )

        self.cities = set(
            _normalize(x)
            for x in (cities or KNOWN_CITIES)
        )

        self.languages = set(
            _normalize(x)
            for x in (languages or KNOWN_LANGUAGES)
        )

        self.technologies = set(
            _normalize(x)
            for x in (technologies or KNOWN_TECHNOLOGIES)
        )

        self.platforms = set(
            _normalize(x)
            for x in (platforms or KNOWN_PLATFORMS)
        )

        self.projects = set(
            _normalize(x)
            for x in (projects or KNOWN_PROJECTS)
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def extract(
        self,
        text: str,
        *,
        hints: Optional[Sequence[Dict[str, Any]]] = None,
    ) -> List[Entity]:
        value = _text(text)

        if not value:
            return []

        entities: List[Entity] = []

        entities.extend(self._extract_dictionary_entities(value))
        entities.extend(self._extract_numbers(value))
        entities.extend(self._extract_dates(value))
        entities.extend(self._extract_explicit_patterns(value))

        if hints:
            entities.extend(
                self._entities_from_hints(
                    value,
                    hints,
                )
            )

        return self._deduplicate(
            self._sort_entities(entities)
        )

    def extract_dicts(
        self,
        text: str,
        *,
        hints: Optional[Sequence[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        return [
            entity.to_dict()
            for entity in self.extract(
                text,
                hints=hints,
            )
        ]

    def find(
        self,
        text: str,
        entity_type: Optional[str] = None,
    ) -> List[Entity]:
        entities = self.extract(text)

        if not entity_type:
            return entities

        wanted = _normalize(entity_type)

        return [
            entity
            for entity in entities
            if _normalize(entity.entity_type) == wanted
        ]

    def find_first(
        self,
        text: str,
        entity_type: Optional[str] = None,
    ) -> Optional[Entity]:
        entities = self.find(
            text,
            entity_type=entity_type,
        )

        return entities[0] if entities else None

    # ------------------------------------------------------------------
    # Dictionary extraction
    # ------------------------------------------------------------------

    def _extract_dictionary_entities(
        self,
        text: str,
    ) -> List[Entity]:

        entities: List[Entity] = []

        groups: List[Tuple[str, set[str]]] = [
            (ENTITY_COUNTRY, self.countries),
            (ENTITY_CITY, self.cities),
            (ENTITY_LANGUAGE, self.languages),
            (ENTITY_TECHNOLOGY, self.technologies),
            (ENTITY_PLATFORM, self.platforms),
            (ENTITY_PROJECT, self.projects),
        ]

        for entity_type, values in groups:
            for normalized_value in values:
                if not normalized_value:
                    continue

                pattern = re.escape(normalized_value)

                for match in re.finditer(
                    pattern,
                    _normalize(text),
                    flags=re.IGNORECASE,
                ):
                    original = self._slice_by_normalized_position(
                        text,
                        match.start(),
                        match.end(),
                    )

                    if not original:
                        original = normalized_value

                    confidence = 0.95

                    if entity_type == ENTITY_PLATFORM:
                        confidence = 0.98

                    if entity_type == ENTITY_PROJECT:
                        confidence = 0.97

                    entities.append(
                        Entity(
                            text=original,
                            entity_type=entity_type,
                            normalized=normalized_value,
                            start=self._approx_original_index(
                                text,
                                match.start(),
                            ),
                            end=self._approx_original_index(
                                text,
                                match.end(),
                            ),
                            confidence=confidence,
                            metadata={
                                "detector": "dictionary",
                            },
                        )
                    )

        return entities

    # ------------------------------------------------------------------
    # Number extraction
    # ------------------------------------------------------------------

    def _extract_numbers(
        self,
        text: str,
    ) -> List[Entity]:

        entities: List[Entity] = []

        number_pattern = re.compile(
            r"""
            (?<![\w])
            (?:
                \d+(?:[.,]\d+)?
                |
                [٠-٩۰-۹]+(?:[.,][٠-٩۰-۹]+)?
            )
            (?![\w])
            """,
            re.VERBOSE,
        )

        for match in number_pattern.finditer(text):
            raw = match.group(0)

            normalized = self._normalize_number(raw)

            entities.append(
                Entity(
                    text=raw,
                    entity_type=ENTITY_NUMBER,
                    normalized=normalized,
                    start=match.start(),
                    end=match.end(),
                    confidence=0.99,
                    metadata={
                        "detector": "number_pattern",
                    },
                )
            )

        return entities

    @staticmethod
    def _normalize_number(value: str) -> str:
        translation = str.maketrans(
            "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹",
            "01234567890123456789",
        )

        return value.translate(translation)

    # ------------------------------------------------------------------
    # Date extraction
    # ------------------------------------------------------------------

    def _extract_dates(
        self,
        text: str,
    ) -> List[Entity]:

        entities: List[Entity] = []

        patterns = [
            r"\b\d{4}-\d{1,2}-\d{1,2}\b",
            r"\b\d{1,2}/\d{1,2}/\d{2,4}\b",
            r"\b\d{1,2}-\d{1,2}-\d{2,4}\b",
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, text):
                entities.append(
                    Entity(
                        text=match.group(0),
                        entity_type=ENTITY_DATE,
                        normalized=match.group(0),
                        start=match.start(),
                        end=match.end(),
                        confidence=0.99,
                        metadata={
                            "detector": "date_pattern",
                        },
                    )
                )

        return entities

    # ------------------------------------------------------------------
    # Explicit patterns
    # ------------------------------------------------------------------

    def _extract_explicit_patterns(
        self,
        text: str,
    ) -> List[Entity]:

        entities: List[Entity] = []

        patterns = [
            (
                ENTITY_COMPANY,
                r"(?:شركة|مؤسسة)\s+([A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9 ._-]{1,80})",
                0.82,
            ),
            (
                ENTITY_ORGANIZATION,
                r"(?:منظمة|جمعية|مؤسسة|جامعة)\s+([A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9 ._-]{1,80})",
                0.80,
            ),
            (
                ENTITY_PERSON,
                r"(?:السيد|السيدة|الأستاذ|الأستاذة|المهندس|المهندسة|الدكتور|الدكتورة)\s+([A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF .'-]{1,60})",
                0.78,
            ),
            (
                ENTITY_LOCATION,
                r"(?:في|بـ|ب|من|إلى|الى)\s+([A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF .'-]{1,50})",
                0.55,
            ),
        ]

        for entity_type, pattern, confidence in patterns:
            for match in re.finditer(
                pattern,
                text,
                flags=re.IGNORECASE,
            ):
                captured = match.group(1).strip(
                    " \t\n\r.,،؛;:!?؟"
                )

                if not captured:
                    continue

                start = match.start(1)
                end = start + len(captured)

                entities.append(
                    Entity(
                        text=captured,
                        entity_type=entity_type,
                        normalized=_normalize(captured),
                        start=start,
                        end=end,
                        confidence=confidence,
                        metadata={
                            "detector": "explicit_pattern",
                        },
                    )
                )

        return entities

    # ------------------------------------------------------------------
    # Hints
    # ------------------------------------------------------------------

    def _entities_from_hints(
        self,
        text: str,
        hints: Sequence[Dict[str, Any]],
    ) -> List[Entity]:

        entities: List[Entity] = []

        for hint in hints:
            if not isinstance(hint, dict):
                continue

            value = _text(
                hint.get(
                    "text",
                    hint.get(
                        "value",
                        hint.get("name", ""),
                    ),
                )
            )

            if not value:
                continue

            entity_type = _text(
                hint.get(
                    "type",
                    hint.get(
                        "entity_type",
                        ENTITY_UNKNOWN,
                    ),
                )
            ) or ENTITY_UNKNOWN

            normalized = _normalize(
                hint.get("normalized", value)
            )

            index = self._find_normalized_position(
                text,
                normalized,
            )

            start = index if index >= 0 else None

            end = (
                start + len(value)
                if start is not None
                else None
            )

            entities.append(
                Entity(
                    text=value,
                    entity_type=entity_type,
                    normalized=normalized,
                    start=start,
                    end=end,
                    confidence=max(
                        0.0,
                        min(
                            1.0,
                            _safe_float(
                                hint.get(
                                    "confidence",
                                    0.90,
                                ),
                                0.90,
                            ),
                        ),
                    ),
                    source=_text(
                        hint.get(
                            "source",
                            "hint",
                        )
                    ) or "hint",
                    metadata=dict(
                        hint.get(
                            "metadata",
                            {},
                        )
                        or {}
                    ),
                )
            )

        return entities

    # ------------------------------------------------------------------
    # Position helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _find_normalized_position(
        text: str,
        normalized: str,
    ) -> int:
        if not normalized:
            return -1

        return _normalize(text).find(
            _normalize(normalized)
        )

    @staticmethod
    def _approx_original_index(
        text: str,
        normalized_index: int,
    ) -> int:
        """
        Approximate an original-text index.

        Exact character alignment is intentionally not claimed because
        normalization can change character counts.
        """
        if normalized_index <= 0:
            return 0

        normalized = _normalize(text)

        if normalized_index >= len(normalized):
            return len(text)

        target = normalized[:normalized_index]

        if not target:
            return 0

        candidate = text.casefold().find(
            target.casefold()
        )

        if candidate >= 0:
            return candidate

        return min(
            normalized_index,
            len(text),
        )

    @staticmethod
    def _slice_by_normalized_position(
        text: str,
        start: int,
        end: int,
    ) -> str:
        normalized = _normalize(text)

        if not normalized:
            return ""

        start = max(0, start)
        end = min(len(normalized), end)

        if start >= end:
            return ""

        fragment = normalized[start:end]

        original_index = text.casefold().find(
            fragment.casefold()
        )

        if original_index >= 0:
            return text[
                original_index:
                original_index + len(fragment)
            ]

        return fragment

    # ------------------------------------------------------------------
    # Sorting / deduplication
    # ------------------------------------------------------------------

    @staticmethod
    def _sort_entities(
        entities: List[Entity],
    ) -> List[Entity]:

        return sorted(
            entities,
            key=lambda entity: (
                entity.start
                if entity.start is not None
                else 10**9,
                -entity.confidence,
                -len(entity.text),
            ),
        )

    @staticmethod
    def _deduplicate(
        entities: List[Entity],
    ) -> List[Entity]:

        result: List[Entity] = []
        seen = set()

        for entity in entities:
            key = (
                _normalize(entity.text),
                _normalize(entity.entity_type),
                entity.start,
                entity.end,
            )

            if key in seen:
                continue

            seen.add(key)
            result.append(entity)

        # Remove weaker overlapping entities when they describe the
        # exact same span and type.
        final: List[Entity] = []

        for entity in result:
            replaced = False

            for index, existing in enumerate(final):
                if (
                    entity.start is not None
                    and entity.end is not None
                    and existing.start is not None
                    and existing.end is not None
                    and entity.start == existing.start
                    and entity.end == existing.end
                    and entity.entity_type == existing.entity_type
                ):
                    if entity.confidence > existing.confidence:
                        final[index] = entity

                    replaced = True
                    break

            if not replaced:
                final.append(entity)

        return final


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def extract_entities(
    text: str,
    *,
    hints: Optional[Sequence[Dict[str, Any]]] = None,
) -> List[Entity]:
    """Extract entities from text using the default extractor."""
    return EntityExtractor().extract(
        text,
        hints=hints,
    )


def extract_entity_dicts(
    text: str,
    *,
    hints: Optional[Sequence[Dict[str, Any]]] = None,
) -> List[Dict[str, Any]]:
    """Return extracted entities as dictionaries."""
    return [
        entity.to_dict()
        for entity in extract_entities(
            text,
            hints=hints,
        )
    ]


def entity_names(
    entities: Iterable[Any],
) -> List[str]:
    """Return entity surface forms."""
    result: List[str] = []

    for item in entities:
        if isinstance(item, Entity):
            value = item.text

        elif isinstance(item, dict):
            value = item.get(
                "text",
                item.get("value", ""),
            )

        else:
            value = str(item or "")

        value = _text(value)

        if value:
            result.append(value)

    return _unique_preserve(result)


def entities_by_type(
    entities: Iterable[Any],
) -> Dict[str, List[Entity]]:
    """Group Entity objects by type."""
    grouped: Dict[str, List[Entity]] = {}

    for item in entities:
        if isinstance(item, dict):
            entity = Entity.from_dict(item)
        elif isinstance(item, Entity):
            entity = item
        else:
            continue

        grouped.setdefault(
            entity.entity_type,
            [],
        ).append(entity)

    return grouped


def entity_dicts_by_type(
    entities: Iterable[Any],
) -> Dict[str, List[Dict[str, Any]]]:
    """Group entities by type and return dictionaries."""
    grouped = entities_by_type(entities)

    return {
        key: [
            entity.to_dict()
            for entity in values
        ]
        for key, values in grouped.items()
    }


def find_entity(
    text: str,
    entity_type: Optional[str] = None,
) -> Optional[Entity]:
    """Return the first matching entity."""
    return EntityExtractor().find_first(
        text,
        entity_type=entity_type,
    )


# ---------------------------------------------------------------------------
# Singleton
# ---------------------------------------------------------------------------

entity_extractor = EntityExtractor()


__all__ = [
    "ENTITY_PERSON",
    "ENTITY_ORGANIZATION",
    "ENTITY_COMPANY",
    "ENTITY_PRODUCT",
    "ENTITY_PLATFORM",
    "ENTITY_COUNTRY",
    "ENTITY_CITY",
    "ENTITY_LOCATION",
    "ENTITY_LANGUAGE",
    "ENTITY_TECHNOLOGY",
    "ENTITY_PROJECT",
    "ENTITY_CONCEPT",
    "ENTITY_DATE",
    "ENTITY_NUMBER",
    "ENTITY_UNKNOWN",
    "Entity",
    "EntityExtractor",
    "extract_entities",
    "extract_entity_dicts",
    "entity_names",
    "entities_by_type",
    "entity_dicts_by_type",
    "find_entity",
    "entity_extractor",
]

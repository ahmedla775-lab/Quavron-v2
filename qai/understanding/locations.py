"""
QAI Understanding Layer
Location extraction and normalization.

This module is intentionally standalone.
It does not depend on Brain, RAG, LLM, or IntentRouter.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class Location:
    text: str
    normalized: str
    kind: str = "unknown"
    start: int = -1
    end: int = -1
    confidence: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# Location vocabulary
# ---------------------------------------------------------------------------

LOCATION_TYPES = {
    "country",
    "city",
    "region",
    "state",
    "province",
    "district",
    "neighborhood",
    "continent",
    "address",
    "location",
}


# High-confidence country names and common Arabic/French/English forms.
COUNTRIES = {
    "الجزائر": "الجزائر",
    "الجزاير": "الجزائر",
    "الجزائرية": "الجزائر",
    "algeria": "الجزائر",
    "algérie": "الجزائر",

    "فرنسا": "فرنسا",
    "france": "فرنسا",
    "français": "فرنسا",

    "المغرب": "المغرب",
    "morocco": "المغرب",
    "maroc": "المغرب",

    "تونس": "تونس",
    "tunisia": "تونس",
    "tunisie": "تونس",

    "ليبيا": "ليبيا",
    "libya": "ليبيا",
    "libye": "ليبيا",

    "مصر": "مصر",
    "egypt": "مصر",
    "égypte": "مصر",

    "السعودية": "السعودية",
    "السعوديه": "السعودية",
    "saudi arabia": "السعودية",
    "arabie saoudite": "السعودية",

    "الإمارات": "الإمارات",
    "الامارات": "الإمارات",
    "uae": "الإمارات",
    "united arab emirates": "الإمارات",

    "قطر": "قطر",
    "qatar": "قطر",

    "الكويت": "الكويت",
    "kuwait": "الكويت",

    "الأردن": "الأردن",
    "الاردن": "الأردن",
    "jordan": "الأردن",

    "فلسطين": "فلسطين",
    "palestine": "فلسطين",

    "العراق": "العراق",
    "iraq": "العراق",

    "سوريا": "سوريا",
    "syria": "سوريا",

    "لبنان": "لبنان",
    "lebanon": "لبنان",

    "تركيا": "تركيا",
    "turkey": "تركيا",
    "turquie": "تركيا",

    "ألمانيا": "ألمانيا",
    "المانيا": "ألمانيا",
    "germany": "ألمانيا",
    "allemagne": "ألمانيا",

    "إيطاليا": "إيطاليا",
    "ايطاليا": "إيطاليا",
    "italy": "إيطاليا",
    "italie": "إيطاليا",

    "إسبانيا": "إسبانيا",
    "اسبانيا": "إسبانيا",
    "spain": "إسبانيا",
    "espagne": "إسبانيا",

    "بريطانيا": "المملكة المتحدة",
    "المملكة المتحدة": "المملكة المتحدة",
    "uk": "المملكة المتحدة",
    "united kingdom": "المملكة المتحدة",

    "الولايات المتحدة": "الولايات المتحدة",
    "أمريكا": "الولايات المتحدة",
    "امريكا": "الولايات المتحدة",
    "usa": "الولايات المتحدة",
    "united states": "الولايات المتحدة",

    "كندا": "كندا",
    "canada": "كندا",

    "الصين": "الصين",
    "china": "الصين",
    "chine": "الصين",

    "اليابان": "اليابان",
    "japan": "اليابان",
    "japon": "اليابان",

    "الهند": "الهند",
    "india": "الهند",
    "inde": "الهند",

    "روسيا": "روسيا",
    "russia": "روسيا",
    "russie": "روسيا",

    "أستراليا": "أستراليا",
    "استراليا": "أستراليا",
    "australia": "أستراليا",
}


# Common Algerian locations because QAI operates in an Algerian context.
ALGERIAN_LOCATIONS = {
    "الجزائر": ("city", "الجزائر"),
    "الجزائر العاصمة": ("city", "الجزائر العاصمة"),
    "العاصمة": ("city", "الجزائر العاصمة"),
    "الجزائر العاصمة": ("city", "الجزائر العاصمة"),

    "الجلفة": ("city", "الجلفة"),
    "djelfa": ("city", "الجلفة"),
    "djelfa wilaya": ("region", "ولاية الجلفة"),

    "وهران": ("city", "وهران"),
    "oran": ("city", "وهران"),

    "قسنطينة": ("city", "قسنطينة"),
    "constantine": ("city", "قسنطينة"),

    "عنابة": ("city", "عنابة"),
    "annaba": ("city", "عنابة"),

    "البليدة": ("city", "البليدة"),
    "blida": ("city", "البليدة"),

    "سطيف": ("city", "سطيف"),
    "setif": ("city", "سطيف"),

    "باتنة": ("city", "باتنة"),
    "batna": ("city", "باتنة"),

    "بسكرة": ("city", "بسكرة"),
    "biskra": ("city", "بسكرة"),

    "تيارت": ("city", "تيارت"),
    "tiaret": ("city", "تيارت"),

    "المدية": ("city", "المدية"),
    "medea": ("city", "المدية"),

    "المسيلة": ("city", "المسيلة"),
    "m'sila": ("city", "المسيلة"),

    "الأغواط": ("city", "الأغواط"),
    "laghouat": ("city", "الأغواط"),

    "غرداية": ("city", "غرداية"),
    "ghardaia": ("city", "غرداية"),

    "تلمسان": ("city", "تلمسان"),
    "tlemcen": ("city", "تلمسان"),

    "بجاية": ("city", "بجاية"),
    "bejaia": ("city", "بجاية"),

    "تيزي وزو": ("city", "تيزي وزو"),
    "tizi ouzou": ("city", "تيزي وزو"),

    "سيدي بلعباس": ("city", "سيدي بلعباس"),
    "sidi bel abbes": ("city", "سيدي بلعباس"),

    "الشلف": ("city", "الشلف"),
    "chlef": ("city", "الشلف"),

    "جيجل": ("city", "جيجل"),
    "jijel": ("city", "جيجل"),

    "الطارف": ("region", "الطارف"),
    "el tarf": ("region", "الطارف"),
}


# ---------------------------------------------------------------------------
# Normalization helpers
# ---------------------------------------------------------------------------

_ARABIC_DIACRITICS = re.compile(
    r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]"
)

_ARABIC_LETTER_VARIANTS = str.maketrans({
    "أ": "ا",
    "إ": "ا",
    "آ": "ا",
    "ٱ": "ا",
    "ى": "ي",
    "ة": "ه",
    "ؤ": "و",
    "ئ": "ي",
})

_SPACE_RE = re.compile(r"\s+")
_EDGE_PUNCTUATION = " \t\r\n.,،؛;:!?؟()[]{}<>\"'`“”‘’«»"


def normalize_location_text(value: Any) -> str:
    """
    Normalize location text without destroying meaningful words.
    """
    text = str(value or "")
    text = text.replace("\u200b", " ")
    text = text.replace("\ufeff", " ")
    text = _ARABIC_DIACRITICS.sub("", text)
    text = text.translate(_ARABIC_LETTER_VARIANTS)
    text = text.lower()
    text = _SPACE_RE.sub(" ", text).strip(_EDGE_PUNCTUATION).strip()
    return text


def canonical_location(value: Any) -> str:
    """
    Return a canonical location name where a known mapping exists.
    """
    normalized = normalize_location_text(value)

    for source, canonical in COUNTRIES.items():
        if normalize_location_text(source) == normalized:
            return canonical

    for source, (_, canonical) in ALGERIAN_LOCATIONS.items():
        if normalize_location_text(source) == normalized:
            return canonical

    return str(value or "").strip()


# ---------------------------------------------------------------------------
# Regex patterns
# ---------------------------------------------------------------------------

# Generic patterns are intentionally conservative.
# Known names are handled separately below.
_ARABIC_LOCATION_WORD = r"[\u0600-\u06FF][\u0600-\u06FF\s\-']{0,50}"
_LATIN_LOCATION_WORD = r"[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s\-']{0,50}"

PATTERNS: Sequence[Tuple[str, str, float]] = (
    (
        "region",
        rf"(?:ولاية|منطقة|إقليم)\s+({_ARABIC_LOCATION_WORD})",
        0.80,
    ),
    (
        "city",
        rf"(?:مدينة|بلدية)\s+({_ARABIC_LOCATION_WORD})",
        0.80,
    ),
    (
        "region",
        rf"(?:province|region|district)\s+({_LATIN_LOCATION_WORD})",
        0.80,
    ),
    (
        "city",
        rf"(?:city|town)\s+({_LATIN_LOCATION_WORD})",
        0.80,
    ),
)


# ---------------------------------------------------------------------------
# Known-name matching
# ---------------------------------------------------------------------------

def _iter_known_locations() -> Iterable[Tuple[str, str, str, float]]:
    """
    Yield:
        surface, canonical, kind, confidence
    """

    for surface, canonical in COUNTRIES.items():
        yield surface, canonical, "country", 0.98

    for surface, (kind, canonical) in ALGERIAN_LOCATIONS.items():
        yield surface, canonical, kind, 0.98


def _same_span(a: Location, b: Location) -> bool:
    return (
        a.start == b.start
        and a.end == b.end
        and a.start >= 0
        and a.end >= 0
    )


def _overlaps(a: Location, b: Location) -> bool:
    if a.start < 0 or a.end < 0 or b.start < 0 or b.end < 0:
        return False

    return a.start < b.end and b.start < a.end


def _prefer_location(a: Location, b: Location) -> Location:
    """
    Resolve overlapping interpretations.

    Priority:
      1. Longer span
      2. Higher confidence
      3. Known semantic type over generic type
    """

    a_len = max(0, a.end - a.start)
    b_len = max(0, b.end - b.start)

    if a_len != b_len:
        return a if a_len > b_len else b

    if a.confidence != b.confidence:
        return a if a.confidence > b.confidence else b

    semantic_priority = {
        "country": 5,
        "region": 4,
        "city": 3,
        "province": 3,
        "district": 2,
        "neighborhood": 2,
        "address": 1,
        "location": 0,
        "unknown": -1,
    }

    return (
        a
        if semantic_priority.get(a.kind, 0)
        >= semantic_priority.get(b.kind, 0)
        else b
    )


def _find_known_locations(text: str) -> List[Location]:
    """
    Find all known locations in text.

    Rules:
    - Match every known location, not only the first one.
    - Prefer the longest surface when locations overlap.
    - Preserve the original surface text.
    - Avoid classifying "الجزائر" as both country and city.
    """
    raw_text = str(text or "")
    normalized_text = normalize_location_text(raw_text)

    results: List[Location] = []

    known = sorted(
        _iter_known_locations(),
        key=lambda item: len(normalize_location_text(item[0])),
        reverse=True,
    )

    for surface, canonical, kind, confidence in known:
        needle = normalize_location_text(surface)

        if not needle:
            continue

        start_pos = 0

        while True:
            index = normalized_text.find(needle, start_pos)

            if index < 0:
                break

            end_index = index + len(needle)

            # Arabic conjunction "و" may be attached directly
            # to the following location:
            #   وفرنسا -> فرنسا
            #   والمغرب -> المغرب
            #   وتونس -> تونس
            previous_char = (
                normalized_text[index - 1]
                if index > 0
                else ""
            )

            before_ok = (
                index == 0
                or not previous_char.isalnum()
                or previous_char == "و"
            )

            after_ok = (
                end_index >= len(normalized_text)
                or not normalized_text[end_index].isalnum()
            )

            if before_ok and after_ok:
                results.append(
                    Location(
                        text=surface,
                        normalized=canonical,
                        kind=kind,
                        start=index,
                        end=end_index,
                        confidence=confidence,
                    )
                )

            start_pos = end_index

    # --------------------------------------------------------
    # Remove overlapping matches.
    # The longest/highest-confidence match wins.
    # --------------------------------------------------------
    results.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            -(item.end - item.start)
            if item.start >= 0 and item.end >= 0
            else 0,
            -item.confidence,
        )
    )

    final: List[Location] = []

    for item in results:
        overlaps = False

        for existing in final:
            if (
                item.start < existing.end
                and existing.start < item.end
            ):
                overlaps = True

                item_len = item.end - item.start
                existing_len = existing.end - existing.start

                # Keep the longer match.
                if (
                    item_len > existing_len
                    or (
                        item_len == existing_len
                        and item.confidence > existing.confidence
                    )
                ):
                    final.remove(existing)
                    overlaps = False

                break

        if not overlaps:
            final.append(item)

    # --------------------------------------------------------
    # Important semantic disambiguation:
    # "الجزائر" is a country by default in generic text.
    # Do not also return it as a city unless the full phrase
    # "الجزائر العاصمة" was explicitly matched.
    # --------------------------------------------------------
    if any(
        item.normalized == "الجزائر العاصمة"
        for item in final
    ):
        final = [
            item
            for item in final
            if not (
                item.normalized == "الجزائر"
                and item.kind == "country"
            )
        ]

    final.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            item.end if item.end >= 0 else 10**9,
        )
    )

    return final

def _deduplicate_locations(
    locations: Iterable[Location],
) -> List[Location]:
    seen = set()
    output: List[Location] = []

    for location in locations:
        key = (
            location.normalized,
            location.kind,
            location.start,
            location.end,
        )

        if key in seen:
            continue

        seen.add(key)
        output.append(location)

    output.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            -(item.end - item.start)
            if item.start >= 0 and item.end >= 0
            else 0,
        )
    )

    return output


# ---------------------------------------------------------------------------
# Public extraction API
# ---------------------------------------------------------------------------

def extract_locations(
    text: Any,
    *,
    include_unknown_patterns: bool = True,
) -> List[Dict[str, Any]]:
    """
    Extract locations from text.

    Known locations are preferred over generic regex captures.
    Generic captures are filtered when they contain a known
    location plus surrounding grammatical words.
    """
    raw_text = str(text or "").strip()

    if not raw_text:
        return []

    locations: List[Location] = []

    # --------------------------------------------------------
    # High-confidence known-name extraction
    # --------------------------------------------------------
    locations.extend(_find_known_locations(raw_text))

    # --------------------------------------------------------
    # Unknown/general patterns
    # --------------------------------------------------------
    if include_unknown_patterns:
        for kind, pattern, confidence in PATTERNS:
            try:
                matches = re.finditer(
                    pattern,
                    raw_text,
                    flags=re.IGNORECASE,
                )
            except re.error:
                continue

            for match in matches:
                if not match.groups():
                    continue

                value = match.group(1).strip(_EDGE_PUNCTUATION).strip()

                if not value:
                    continue

                # إذا كانت القيمة تحتوي على موقع معروف بداخلها،
                # لا نضيف العبارة العامة مثل "في الجزائر"
                # أو "ولاية الجلفة".
                nested = _find_known_locations(value)

                if nested:
                    continue

                canonical = canonical_location(value)

                locations.append(
                    Location(
                        text=value,
                        normalized=canonical,
                        kind=kind,
                        start=match.start(1),
                        end=match.end(1),
                        confidence=confidence,
                    )
                )

    # --------------------------------------------------------
    # Deduplicate + remove overlapping weaker matches
    # --------------------------------------------------------
    locations = _deduplicate_locations(locations)

    final_locations: List[Location] = []

    for item in locations:
        overlap = False

        for existing in final_locations:
            if (
                item.start >= 0
                and item.end >= 0
                and existing.start >= 0
                and existing.end >= 0
                and item.start < existing.end
                and existing.start < item.end
            ):
                # الاحتفاظ بالمطابقة الأطول/الأعلى ثقة.
                item_len = item.end - item.start
                existing_len = existing.end - existing.start

                if (
                    existing.confidence > item.confidence
                    or (
                        existing.confidence == item.confidence
                        and existing_len >= item_len
                    )
                ):
                    overlap = True
                    break

        if not overlap:
            final_locations.append(item)

    final_locations.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            -(item.end - item.start)
            if item.start >= 0 and item.end >= 0
            else 0,
        )
    )

    return [
        location.to_dict()
        for location in final_locations
    ]

def extract_location_names(text: Any) -> List[str]:
    """
    Return only canonical location names.
    """
    return [
        item["normalized"]
        for item in extract_locations(text)
        if item.get("normalized")
    ]


def find_location(
    text: Any,
    location: Any,
) -> Optional[Dict[str, Any]]:
    """
    Find a specific location in text.
    """
    target = normalize_location_text(location)

    if not target:
        return None

    for item in extract_locations(text):
        if (
            normalize_location_text(item.get("text", ""))
            == target
            or normalize_location_text(item.get("normalized", ""))
            == target
        ):
            return item

    return None


def has_location(text: Any) -> bool:
    return bool(extract_locations(text))


def has_country(text: Any) -> bool:
    return any(
        item.get("kind") == "country"
        for item in extract_locations(text)
    )


def has_city(text: Any) -> bool:
    return any(
        item.get("kind") == "city"
        for item in extract_locations(text)
    )


def locations_by_type(
    text: Any,
) -> Dict[str, List[Dict[str, Any]]]:
    """
    Group extracted locations by semantic type.
    """
    grouped: Dict[str, List[Dict[str, Any]]] = {}

    for item in extract_locations(text):
        kind = item.get("kind", "unknown")

        grouped.setdefault(kind, []).append(item)

    return grouped


# ---------------------------------------------------------------------------
# Question-aware helpers
# ---------------------------------------------------------------------------

def extract_target_location(text: Any) -> Optional[str]:
    """
    Extract the most likely target location from a question.

    Examples:
        ما عاصمة الجزائر؟              -> الجزائر
        ما هي عاصمة مصر؟              -> مصر
        ماذا يوجد في الجزائر؟         -> الجزائر
        ما عدد سكان الجلفة؟           -> الجلفة
        ما هي المدن الموجودة في ولاية الجلفة؟ -> الجلفة
        أين تقع الجزائر العاصمة؟      -> الجزائر العاصمة
    """
    question = str(text or "").strip()

    if not question:
        return None

    # --------------------------------------------------------
    # Explicit semantic patterns
    # --------------------------------------------------------
    patterns = (
        # عاصمة X
        r"ما\s+(?:هي\s+)?عاصمة\s+(.+?)\s*[؟?!.,،؛;]*$",

        # عدد سكان X
        r"ما\s+(?:هو\s+)?عدد\s+سكان\s+(.+?)\s*[؟?!.,،؛;]*$",

        # سكان X
        r"سكان\s+(.+?)\s*[؟?!.,،؛;]*$",

        # ولاية X / مدينة X / منطقة X
        r"(?:ولاية|مدينة|منطقة|بلدية)\s+(.+?)\s*[؟?!.,،؛;]*$",

        # في/من/إلى X
        r"(?:في|من|إلى|الى)\s+(.+?)\s*[؟?!.,،؛;]*$",

        # English
        r"(?:in|from|to)\s+(.+?)\s*[?!.,]*$",
    )

    for pattern in patterns:
        match = re.search(
            pattern,
            question,
            flags=re.IGNORECASE,
        )

        if not match:
            continue

        value = match.group(1).strip(_EDGE_PUNCTUATION).strip()

        if not value:
            continue

        # إذا كان التعبير "ولاية الجلفة" أو "مدينة الجلفة"
        # نبحث أولاً عن الموقع الحقيقي داخل العبارة.
        extracted = extract_locations(value)

        if extracted:
            extracted = sorted(
                extracted,
                key=lambda item: (
                    -float(item.get("confidence", 0) or 0),
                    -(int(item.get("end", 0)) - int(item.get("start", 0)))
                    if item.get("start", -1) >= 0
                    and item.get("end", -1) >= 0
                    else 0,
                ),
            )

            return str(
                extracted[0].get("normalized")
                or extracted[0].get("text")
                or ""
            ).strip() or None

        canonical = canonical_location(value)

        if canonical:
            return canonical

    # --------------------------------------------------------
    # Fallback: known locations anywhere in the question
    # --------------------------------------------------------
    locations = extract_locations(question)

    if locations:
        locations = sorted(
            locations,
            key=lambda item: (
                -float(item.get("confidence", 0) or 0),
                item.get("start", 10**9),
            ),
        )

        return str(
            locations[0].get("normalized")
            or locations[0].get("text")
            or ""
        ).strip() or None

    return None

def extract_location_context(text: Any) -> Dict[str, Any]:
    """
    Produce a compact structured representation for the future parser.
    """
    locations = extract_locations(text)

    return {
        "locations": locations,
        "names": [
            item.get("normalized")
            for item in locations
            if item.get("normalized")
        ],
        "countries": [
            item.get("normalized")
            for item in locations
            if item.get("kind") == "country"
        ],
        "cities": [
            item.get("normalized")
            for item in locations
            if item.get("kind") == "city"
        ],
        "count": len(locations),
        "has_location": bool(locations),
    }


# ---------------------------------------------------------------------------
# Public aliases
# ---------------------------------------------------------------------------

parse_locations = extract_locations
get_locations = extract_locations
normalize_location = canonical_location


__all__ = [
    "Location",
    "LOCATION_TYPES",
    "COUNTRIES",
    "ALGERIAN_LOCATIONS",
    "normalize_location_text",
    "canonical_location",
    "extract_locations",
    "extract_location_names",
    "find_location",
    "has_location",
    "has_country",
    "has_city",
    "locations_by_type",
    "extract_target_location",
    "extract_location_context",
    "parse_locations",
    "get_locations",
    "normalize_location",
]

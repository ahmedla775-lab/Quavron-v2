"""
QAI Understanding Layer
=======================

Number understanding and normalization.

Responsibilities:
- Arabic and Latin digit normalization.
- Arabic number-word recognition.
- Integer and decimal extraction.
- Percentages.
- Ordinal numbers.
- Numeric ranges.
- Approximate quantities.
- Safe conversion without guessing unsupported values.

This module is intentionally standalone.
It does not depend on RAG, LLM, Brain, or IntentRouter.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Digit normalization
# ---------------------------------------------------------------------------

_ARABIC_INDIC_DIGITS = str.maketrans(
    "٠١٢٣٤٥٦٧٨٩",
    "0123456789",
)

_EASTERN_ARABIC_DIGITS = str.maketrans(
    "۰۱۲۳۴۵۶۷۸۹",
    "0123456789",
)


def normalize_digits(text: Any) -> str:
    """
    Convert Arabic-Indic and Eastern Arabic-Indic digits to Latin digits.
    """
    value = str(text or "")
    value = value.translate(_ARABIC_INDIC_DIGITS)
    value = value.translate(_EASTERN_ARABIC_DIGITS)
    return value


# ---------------------------------------------------------------------------
# Number words
# ---------------------------------------------------------------------------

_UNITS: Dict[str, int] = {
    "صفر": 0,
    "واحد": 1,
    "واحدة": 1,
    "اثنان": 2,
    "اثنين": 2,
    "اثنتان": 2,
    "اثنتين": 2,
    "ثلاثة": 3,
    "ثلاث": 3,
    "أربعة": 4,
    "أربع": 4,
    "خمسة": 5,
    "خمس": 5,
    "ستة": 6,
    "ست": 6,
    "سبعة": 7,
    "سبع": 7,
    "ثمانية": 8,
    "ثمان": 8,
    "ثماني": 8,
    "تسعة": 9,
    "تسع": 9,
}

_TEENS: Dict[str, int] = {
    "عشرة": 10,
    "عشر": 10,
    "أحد عشر": 11,
    "احد عشر": 11,
    "إحدى عشرة": 11,
    "احدى عشرة": 11,
    "اثنا عشر": 12,
    "اثني عشر": 12,
    "اثنا عشر": 12,
    "اثنتا عشرة": 12,
    "اثنتي عشرة": 12,
    "ثلاثة عشر": 13,
    "ثلاث عشر": 13,
    "أربعة عشر": 14,
    "أربع عشر": 14,
    "خمسة عشر": 15,
    "خمس عشر": 15,
    "ستة عشر": 16,
    "ست عشر": 16,
    "سبعة عشر": 17,
    "سبع عشر": 17,
    "ثمانية عشر": 18,
    "ثمان عشر": 18,
    "تسعة عشر": 19,
    "تسع عشر": 19,
}

_TENS: Dict[str, int] = {
    "عشرون": 20,
    "عشرين": 20,
    "ثلاثون": 30,
    "ثلاثين": 30,
    "أربعون": 40,
    "أربعين": 40,
    "خمسون": 50,
    "خمسين": 50,
    "ستون": 60,
    "ستين": 60,
    "سبعون": 70,
    "سبعين": 70,
    "ثمانون": 80,
    "ثمانين": 80,
    "تسعون": 90,
    "تسعين": 90,
}

_SCALES: Dict[str, int] = {
    "مائة": 100,
    "مئة": 100,
    "مائه": 100,
    "مائتان": 200,
    "مئتان": 200,
    "مئتين": 200,
    "مائتين": 200,
    "ألف": 1000,
    "الف": 1000,
    "آلاف": 1000,
    "ألفا": 1000,
    "ألفين": 2000,
    "مليون": 1_000_000,
    "ملايين": 1_000_000,
    "مليار": 1_000_000_000,
    "مليارات": 1_000_000_000,
    "تريليون": 1_000_000_000_000,
}

_ALL_NUMBER_WORDS = set(
    list(_UNITS)
    + list(_TEENS)
    + list(_TENS)
    + list(_SCALES)
    + ["و"]
)


def _normalize_number_words(text: str) -> str:
    """
    Normalize common spelling variants used when expressing Arabic numbers.
    """
    value = str(text or "").strip().lower()

    replacements = {
        "إثنان": "اثنان",
        "إثنين": "اثنين",
        "إثنتان": "اثنتان",
        "إثنتين": "اثنتين",
        "إحدى": "إحدى",
        "مئه": "مئة",
        "مائه": "مئة",
        "الف": "ألف",
        "مليونين": "مليون",
    }

    for old, new in replacements.items():
        value = value.replace(old, new)

    return value


def parse_arabic_number_words(text: Any) -> Optional[int]:
    """
    Parse a relatively standard Arabic number expression.

    Examples:
        "ثلاثة" -> 3
        "خمسة وعشرون" -> 25
        "مائة وعشرون" -> 120
        "ألف ومائتان" -> 1200

    Returns None when the expression cannot be interpreted safely.
    """
    value = _normalize_number_words(str(text or ""))

    if not value:
        return None

    value = re.sub(r"[،,؛;]", " ", value)
    tokens = [token for token in value.split() if token]

    if not tokens:
        return None

    if any(token not in _ALL_NUMBER_WORDS for token in tokens):
        return None

    total = 0
    current = 0

    for token in tokens:
        if token == "و":
            continue

        if token in _UNITS:
            current += _UNITS[token]
            continue

        if token in _TEENS:
            current += _TEENS[token]
            continue

        if token in _TENS:
            current += _TENS[token]
            continue

        if token in _SCALES:
            scale = _SCALES[token]

            if current == 0:
                current = 1

            total += current * scale
            current = 0
            continue

        return None

    result = total + current

    return result if result >= 0 else None


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------


@dataclass
class NumberMention:
    """
    Structured numeric mention.
    """

    text: str
    value: Optional[float] = None
    kind: str = "number"
    start: int = -1
    end: int = -1
    normalized: str = ""
    unit: Optional[str] = None
    approximate: bool = False
    operator: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# Numeric patterns
# ---------------------------------------------------------------------------

_DECIMAL_RE = re.compile(
    r"""
    (?<![\w])
    [-+]?
    \d+(?:[.,]\d+)?
    (?![\w])
    """,
    re.VERBOSE,
)

_PERCENT_RE = re.compile(
    r"""
    (?<![\w])
    [-+]?
    \d+(?:[.,]\d+)?
    \s*
    (?:%|٪|بالمئة|بالمائة|في\s*المئة)
    """,
    re.VERBOSE | re.IGNORECASE,
)

_RANGE_RE = re.compile(
    r"""
    (?P<left>
        [-+]?\d+(?:[.,]\d+)?
    )
    \s*
    (?P<separator>
        -|–|—|إلى|الى|حتى
    )
    \s*
    (?P<right>
        [-+]?\d+(?:[.,]\d+)?
    )
    """,
    re.VERBOSE | re.IGNORECASE,
)

_ORDINAL_RE = re.compile(
    r"""
    \b
    (?:
        الأول|الأول|اول|
        الثاني|الثاني|
        الثالث|
        الرابع|
        الخامس|
        السادس|
        السابع|
        الثامن|
        التاسع|
        العاشر|
        الحادي عشر|
        الثاني عشر|
        الثالث عشر|
        الرابع عشر|
        الخامس عشر|
        السادس عشر|
        السابع عشر|
        الثامن عشر|
        التاسع عشر|
        العشرون|
        الثلاثون|
        الأربعون|
        الخمسون|
        الستون|
        السبعون|
        الثمانون|
        التسعون
    )
    \b
    """,
    re.VERBOSE,
)

_APPROXIMATE_MARKERS = (
    "حوالي",
    "تقريبا",
    "تقريباً",
    "نحو",
    "قرابة",
    "ما يقارب",
    "أكثر من",
    "أقل من",
    "ما يزيد عن",
    "ما يقل عن",
    "around",
    "about",
    "approximately",
    "roughly",
    "more than",
    "less than",
)

_NUMBER_UNITS = (
    "كيلومتر",
    "كيلومترات",
    "كم",
    "متر",
    "أمتار",
    "سم",
    "سنتيمتر",
    "سنتيمترات",
    "ملليمتر",
    "ملليمترات",
    "كغ",
    "كجم",
    "كيلوغرام",
    "كيلوغرامات",
    "غرام",
    "غرامات",
    "طن",
    "أطنان",
    "لتر",
    "لترات",
    "مل",
    "ميلي لتر",
    "دولار",
    "دولارات",
    "يورو",
    "دينار",
    "دنانير",
    "جنيه",
    "ريال",
    "درهم",
    "سنة",
    "سنوات",
    "عام",
    "أعوام",
    "شهر",
    "أشهر",
    "يوم",
    "أيام",
    "ساعة",
    "ساعات",
    "دقيقة",
    "دقائق",
    "ثانية",
    "ثوان",
    "٪",
    "%",
)


# ---------------------------------------------------------------------------
# Conversion helpers
# ---------------------------------------------------------------------------


def _parse_numeric_value(value: str) -> Optional[float]:
    """
    Parse a Latin/Arabic normalized numeric string safely.
    """
    if not value:
        return None

    value = normalize_digits(value).strip()

    # Remove common percentage suffixes.
    value = re.sub(
        r"\s*(?:%|٪|بالمئة|بالمائة|في\s*المئة)\s*$",
        "",
        value,
        flags=re.IGNORECASE,
    )

    value = value.replace(",", ".")

    try:
        number = float(value)
    except (TypeError, ValueError):
        return None

    if number.is_integer():
        return int(number)

    return number


def _unit_after(text: str, end: int) -> Optional[str]:
    """
    Detect a numeric unit immediately after a number.
    """
    tail = text[end:end + 40].strip()

    if not tail:
        return None

    lowered = tail.lower()

    # Longest-first matching.
    for unit in sorted(_NUMBER_UNITS, key=len, reverse=True):
        if lowered.startswith(unit.lower()):
            boundary = len(unit)

            if len(lowered) == boundary:
                return unit

            next_char = lowered[boundary]

            if next_char.isspace() or next_char in ".,،؛;:!?؟)]}":
                return unit

    return None


def _is_approximate(text: str, start: int) -> Tuple[bool, Optional[str]]:
    """
    Inspect a small context window before the number.
    """
    prefix = text[max(0, start - 35):start].strip().lower()

    for marker in sorted(
        _APPROXIMATE_MARKERS,
        key=len,
        reverse=True,
    ):
        if prefix.endswith(marker):
            operator = None

            if marker in {"أكثر من", "ما يزيد عن", "more than"}:
                operator = ">"
            elif marker in {"أقل من", "ما يقل عن", "less than"}:
                operator = "<"

            return True, operator

    return False, None


# ---------------------------------------------------------------------------
# Numeric extraction
# ---------------------------------------------------------------------------


def extract_numbers(text: Any) -> List[NumberMention]:
    """
    Extract structured numeric mentions from text.

    The function recognizes:
    - ordinary numbers
    - decimals
    - percentages
    - ranges
    - Arabic number words
    - ordinal expressions
    - approximate numbers
    - basic units
    """
    raw = str(text or "")
    normalized_text = normalize_digits(raw)

    mentions: List[NumberMention] = []

    # ---------------------------------------------------------------
    # Ranges first
    # ---------------------------------------------------------------

    occupied: List[Tuple[int, int]] = []

    for match in _RANGE_RE.finditer(normalized_text):
        left = _parse_numeric_value(match.group("left"))
        right = _parse_numeric_value(match.group("right"))

        if left is None or right is None:
            continue

        start = match.start()
        end = match.end()

        unit = _unit_after(normalized_text, end)
        approximate, operator = _is_approximate(
            normalized_text,
            start,
        )

        mentions.append(
            NumberMention(
                text=match.group(0),
                value=right,
                kind="range",
                start=start,
                end=end,
                normalized=f"{left}:{right}",
                unit=unit,
                approximate=approximate,
                operator=operator,
            )
        )

        occupied.append((start, end))

    # ---------------------------------------------------------------
    # Percentages
    # ---------------------------------------------------------------

    for match in _PERCENT_RE.finditer(normalized_text):
        start = match.start()
        end = match.end()

        if any(
            start >= old_start and end <= old_end
            for old_start, old_end in occupied
        ):
            continue

        value = _parse_numeric_value(match.group(0))

        if value is None:
            continue

        approximate, operator = _is_approximate(
            normalized_text,
            start,
        )

        mentions.append(
            NumberMention(
                text=match.group(0),
                value=value,
                kind="percentage",
                start=start,
                end=end,
                normalized=str(value),
                unit="%",
                approximate=approximate,
                operator=operator,
            )
        )

        occupied.append((start, end))

    # ---------------------------------------------------------------
    # Ordinary numeric values
    # ---------------------------------------------------------------

    for match in _DECIMAL_RE.finditer(normalized_text):
        start = match.start()
        end = match.end()

        if any(
            start >= old_start and end <= old_end
            for old_start, old_end in occupied
        ):
            continue

        value = _parse_numeric_value(match.group(0))

        if value is None:
            continue

        unit = _unit_after(normalized_text, end)
        approximate, operator = _is_approximate(
            normalized_text,
            start,
        )

        mentions.append(
            NumberMention(
                text=match.group(0),
                value=value,
                kind="decimal" if "." in match.group(0) else "number",
                start=start,
                end=end,
                normalized=str(value),
                unit=unit,
                approximate=approximate,
                operator=operator,
            )
        )

        occupied.append((start, end))

    # ---------------------------------------------------------------
    # Arabic number words
    # ---------------------------------------------------------------

    words = normalized_text.split()

    if words:
        cursor = 0

        for index in range(len(words)):
            phrase_tokens: List[str] = []

            for end_index in range(
                index,
                min(index + 7, len(words)),
            ):
                token = re.sub(
                    r"^[^\w\u0600-\u06ff]+|[^\w\u0600-\u06ff]+$",
                    "",
                    words[end_index],
                )

                if not token:
                    continue

                if token not in _ALL_NUMBER_WORDS:
                    break

                phrase_tokens.append(token)

                phrase = " ".join(phrase_tokens)
                value = parse_arabic_number_words(phrase)

                if value is None:
                    continue

                phrase_start = normalized_text.find(
                    phrase_tokens[0],
                    cursor,
                )

                if phrase_start < 0:
                    continue

                phrase_end = phrase_start + len(phrase)

                if any(
                    phrase_start >= old_start
                    and phrase_end <= old_end
                    for old_start, old_end in occupied
                ):
                    continue

                unit = _unit_after(
                    normalized_text,
                    phrase_end,
                )

                approximate, operator = _is_approximate(
                    normalized_text,
                    phrase_start,
                )

                mentions.append(
                    NumberMention(
                        text=phrase,
                        value=value,
                        kind="number_word",
                        start=phrase_start,
                        end=phrase_end,
                        normalized=str(value),
                        unit=unit,
                        approximate=approximate,
                        operator=operator,
                    )
                )

                occupied.append(
                    (phrase_start, phrase_end)
                )

                # Prefer the longest valid phrase.
                cursor = phrase_end

            if cursor:
                continue

    # ---------------------------------------------------------------
    # Sort and deduplicate
    # ---------------------------------------------------------------

    mentions.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            -(item.end - item.start),
        )
    )

    unique: List[NumberMention] = []
    seen = set()

    for item in mentions:
        key = (
            item.start,
            item.end,
            item.kind,
            item.normalized,
        )

        if key in seen:
            continue

        seen.add(key)
        unique.append(item)

    return unique


# ---------------------------------------------------------------------------
# Specialized extraction
# ---------------------------------------------------------------------------


def extract_percentages(text: Any) -> List[NumberMention]:
    """
    Return only percentage mentions.
    """
    return [
        item
        for item in extract_numbers(text)
        if item.kind == "percentage"
    ]


def extract_ranges(text: Any) -> List[NumberMention]:
    """
    Return only numeric ranges.
    """
    return [
        item
        for item in extract_numbers(text)
        if item.kind == "range"
    ]


def extract_ordinals(text: Any) -> List[NumberMention]:
    """
    Extract common Arabic ordinal expressions.
    """
    raw = normalize_digits(str(text or ""))
    results: List[NumberMention] = []

    ordinal_values = {
        "الأول": 1,
        "الأولى": 1,
        "اول": 1,
        "الأول": 1,
        "الثاني": 2,
        "الثانية": 2,
        "الثالث": 3,
        "الثالثة": 3,
        "الرابع": 4,
        "الرابعة": 4,
        "الخامس": 5,
        "الخامسة": 5,
        "السادس": 6,
        "السادسة": 6,
        "السابع": 7,
        "السابعة": 7,
        "الثامن": 8,
        "الثامنة": 8,
        "التاسع": 9,
        "التاسعة": 9,
        "العاشر": 10,
        "العاشرة": 10,
        "الحادي عشر": 11,
        "الثاني عشر": 12,
        "الثالث عشر": 13,
        "الرابع عشر": 14,
        "الخامس عشر": 15,
        "السادس عشر": 16,
        "السابع عشر": 17,
        "الثامن عشر": 18,
        "التاسع عشر": 19,
        "العشرون": 20,
        "الثلاثون": 30,
        "الأربعون": 40,
        "الخمسون": 50,
        "الستون": 60,
        "السبعون": 70,
        "الثمانون": 80,
        "التسعون": 90,
    }

    for match in _ORDINAL_RE.finditer(raw):
        phrase = match.group(0).strip()
        value = ordinal_values.get(phrase)

        if value is None:
            continue

        results.append(
            NumberMention(
                text=phrase,
                value=value,
                kind="ordinal",
                start=match.start(),
                end=match.end(),
                normalized=str(value),
            )
        )

    return results


# ---------------------------------------------------------------------------
# Query helpers
# ---------------------------------------------------------------------------


def contains_number(text: Any) -> bool:
    """
    Return True when text contains a recognized number.
    """
    return bool(extract_numbers(text))


def first_number(text: Any) -> Optional[NumberMention]:
    """
    Return the first recognized numeric mention.
    """
    values = extract_numbers(text)
    return values[0] if values else None


def numeric_values(text: Any) -> List[float]:
    """
    Return recognized numeric values only.
    """
    values: List[float] = []

    for item in extract_numbers(text):
        if item.value is not None:
            values.append(item.value)

    return values


def normalize_numeric_expression(text: Any) -> str:
    """
    Normalize digits and preserve the textual structure of the expression.
    """
    value = normalize_digits(str(text or ""))

    # Normalize decimal comma when surrounded by digits.
    value = re.sub(
        r"(?<=\d),(?=\d)",
        ".",
        value,
    )

    # Normalize Arabic percent sign.
    value = value.replace("٪", "%")

    # Collapse spaces.
    value = re.sub(r"\s+", " ", value).strip()

    return value


def number_summary(text: Any) -> Dict[str, Any]:
    """
    Produce a stable machine-readable summary.
    """
    mentions = extract_numbers(text)
    ordinals = extract_ordinals(text)

    return {
        "text": str(text or ""),
        "normalized": normalize_numeric_expression(text),
        "has_number": bool(mentions),
        "count": len(mentions),
        "numbers": [
            item.to_dict()
            for item in mentions
        ],
        "ordinals": [
            item.to_dict()
            for item in ordinals
        ],
        "values": numeric_values(text),
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

__all__ = [
    "NumberMention",
    "normalize_digits",
    "parse_arabic_number_words",
    "extract_numbers",
    "extract_percentages",
    "extract_ranges",
    "extract_ordinals",
    "contains_number",
    "first_number",
    "numeric_values",
    "normalize_numeric_expression",
    "number_summary",
]

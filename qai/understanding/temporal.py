"""
QAI Understanding Layer
========================
Temporal understanding utilities.

This module is intentionally standalone and dependency-light.
It does not modify the existing intent router, reasoning engine,
RAG, Brain, or LocalDriver.

Responsibilities:
- Detect temporal expressions in Arabic, English, and French.
- Recognize relative time expressions.
- Recognize calendar/date expressions.
- Recognize durations.
- Recognize temporal question markers.
- Normalize temporal expressions into structured dictionaries.
- Provide deterministic temporal metadata for later pipeline integration.

No external packages are required.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, asdict
from datetime import date, datetime, timedelta
from typing import Any, Dict, Iterable, List, Optional, Tuple


# ============================================================
# DATA STRUCTURES
# ============================================================

@dataclass(frozen=True)
class TemporalExpression:
    """
    Represents one detected temporal expression.
    """

    text: str
    normalized: str
    kind: str
    value: Any = None
    unit: Optional[str] = None
    direction: Optional[str] = None
    confidence: float = 1.0
    start: int = -1
    end: int = -1

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# ============================================================
# CONSTANTS
# ============================================================

ARABIC_MONTHS = {
    "يناير": 1,
    "جانفي": 1,
    "فبراير": 2,
    "فيفري": 2,
    "مارس": 3,
    "أفريل": 4,
    "ابريل": 4,
    "أبريل": 4,
    "ماي": 5,
    "مايو": 5,
    "يونيو": 6,
    "جوان": 6,
    "يوليو": 7,
    "جويلية": 7,
    "أغسطس": 8,
    "اوت": 8,
    "أوت": 8,
    "سبتمبر": 9,
    "أكتوبر": 10,
    "اكتوبر": 10,
    "نوفمبر": 11,
    "ديسمبر": 12,
}

ENGLISH_MONTHS = {
    "january": 1,
    "jan": 1,
    "february": 2,
    "feb": 2,
    "march": 3,
    "mar": 3,
    "april": 4,
    "apr": 4,
    "may": 5,
    "june": 6,
    "jun": 6,
    "july": 7,
    "jul": 7,
    "august": 8,
    "aug": 8,
    "september": 9,
    "sep": 9,
    "sept": 9,
    "october": 10,
    "oct": 10,
    "november": 11,
    "nov": 11,
    "december": 12,
    "dec": 12,
}

FRENCH_MONTHS = {
    "janvier": 1,
    "février": 2,
    "fevrier": 2,
    "mars": 3,
    "avril": 4,
    "mai": 5,
    "juin": 6,
    "juillet": 7,
    "août": 8,
    "aout": 8,
    "septembre": 9,
    "octobre": 10,
    "novembre": 11,
    "décembre": 12,
    "decembre": 12,
}

WEEKDAYS = {
    # Arabic
    "الاثنين": 0,
    "الإثنين": 0,
    "الثلاثاء": 1,
    "الأربعاء": 2,
    "الاربعاء": 2,
    "الخميس": 3,
    "الجمعة": 4,
    "السبت": 5,
    "الأحد": 6,
    "الاحد": 6,

    # English
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,

    # French
    "lundi": 0,
    "mardi": 1,
    "mercredi": 2,
    "jeudi": 3,
    "vendredi": 4,
    "samedi": 5,
    "dimanche": 6,
}


# ============================================================
# NORMALIZATION
# ============================================================

def _clean_text(text: Any) -> str:
    """
    Convert input to safe normalized text without changing
    semantic content.
    """

    if text is None:
        return ""

    value = str(text)

    value = value.replace("\u200f", "")
    value = value.replace("\u200e", "")
    value = value.replace("\ufeff", "")
    value = value.replace("\u00a0", " ")

    value = re.sub(r"\s+", " ", value)

    return value.strip()


def _normalize_digits(text: str) -> str:
    """
    Convert Arabic-Indic and Persian digits to ASCII digits.
    """

    translation = str.maketrans(
        "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹",
        "01234567890123456789",
    )

    return text.translate(translation)


def _normalize_arabic(text: str) -> str:
    """
    Conservative Arabic normalization for matching.
    """

    value = text

    value = value.replace("أ", "ا")
    value = value.replace("إ", "ا")
    value = value.replace("آ", "ا")

    value = value.replace("ى", "ي")

    value = value.replace("ة", "ه")

    value = re.sub(r"[\u064B-\u065F\u0670]", "", value)

    value = value.replace("ـ", "")

    return value


def normalize_temporal_text(text: Any) -> str:
    """
    Public temporal normalization function.
    """

    value = _clean_text(text)
    value = _normalize_digits(value)
    value = _normalize_arabic(value)

    return value.lower()


# ============================================================
# RELATIVE TIME
# ============================================================

RELATIVE_PATTERNS: List[Tuple[str, str, int, str, str]] = [
    # Arabic
    (r"\bاليوم\b", "relative_day", 0, "day", "current"),
    (r"\bغدا\b", "relative_day", 1, "day", "future"),
    (r"\bغدًا\b", "relative_day", 1, "day", "future"),
    (r"\bأمس\b", "relative_day", -1, "day", "past"),
    (r"\bامس\b", "relative_day", -1, "day", "past"),

    (r"\bبعد غد\b", "relative_day", 2, "day", "future"),
    (r"\bبعد غدا\b", "relative_day", 2, "day", "future"),

    (r"\bالآن\b", "relative_time", 0, "now", "current"),
    (r"\bالان\b", "relative_time", 0, "now", "current"),
    (r"\bحاليا\b", "relative_time", 0, "now", "current"),
    (r"\bحاليًا\b", "relative_time", 0, "now", "current"),

    (r"\bهذا الأسبوع\b", "relative_week", 0, "week", "current"),
    (r"\bهذا الشهر\b", "relative_month", 0, "month", "current"),
    (r"\bهذه السنة\b", "relative_year", 0, "year", "current"),

    (r"\bالأسبوع القادم\b", "relative_week", 1, "week", "future"),
    (r"\bالاسبوع القادم\b", "relative_week", 1, "week", "future"),
    (r"\bالشهر القادم\b", "relative_month", 1, "month", "future"),
    (r"\bالسنه القادمه\b", "relative_year", 1, "year", "future"),

    (r"\bالأسبوع الماضي\b", "relative_week", -1, "week", "past"),
    (r"\bالاسبوع الماضي\b", "relative_week", -1, "week", "past"),
    (r"\bالشهر الماضي\b", "relative_month", -1, "month", "past"),
    (r"\bالسنه الماضيه\b", "relative_year", -1, "year", "past"),

    # English
    (r"\btoday\b", "relative_day", 0, "day", "current"),
    (r"\btomorrow\b", "relative_day", 1, "day", "future"),
    (r"\byesterday\b", "relative_day", -1, "day", "past"),
    (r"\bnow\b", "relative_time", 0, "now", "current"),
    (r"\bright now\b", "relative_time", 0, "now", "current"),
    (r"\bthis week\b", "relative_week", 0, "week", "current"),
    (r"\bthis month\b", "relative_month", 0, "month", "current"),
    (r"\bthis year\b", "relative_year", 0, "year", "current"),
    (r"\bnext week\b", "relative_week", 1, "week", "future"),
    (r"\bnext month\b", "relative_month", 1, "month", "future"),
    (r"\bnext year\b", "relative_year", 1, "year", "future"),
    (r"\blast week\b", "relative_week", -1, "week", "past"),
    (r"\blast month\b", "relative_month", -1, "month", "past"),
    (r"\blast year\b", "relative_year", -1, "year", "past"),

    # French
    (r"\baujourd'hui\b", "relative_day", 0, "day", "current"),
    (r"\bdemain\b", "relative_day", 1, "day", "future"),
    (r"\bhier\b", "relative_day", -1, "day", "past"),
    (r"\bmaintenant\b", "relative_time", 0, "now", "current"),
    (r"\bcette semaine\b", "relative_week", 0, "week", "current"),
    (r"\bce mois-ci\b", "relative_month", 0, "month", "current"),
    (r"\bcette année\b", "relative_year", 0, "year", "current"),
    (r"\bla semaine prochaine\b", "relative_week", 1, "week", "future"),
    (r"\ble mois prochain\b", "relative_month", 1, "month", "future"),
    (r"\bl'année prochaine\b", "relative_year", 1, "year", "future"),
    (r"\bla semaine dernière\b", "relative_week", -1, "week", "past"),
    (r"\ble mois dernier\b", "relative_month", -1, "month", "past"),
    (r"\bl'année dernière\b", "relative_year", -1, "year", "past"),
]


def detect_relative_time(text: Any) -> List[TemporalExpression]:
    """
    Detect relative temporal expressions.
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    results: List[TemporalExpression] = []

    for pattern, kind, value, unit, direction in RELATIVE_PATTERNS:
        for match in re.finditer(pattern, normalized, flags=re.IGNORECASE):
            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind=kind,
                    value=value,
                    unit=unit,
                    direction=direction,
                    confidence=0.98,
                    start=match.start(),
                    end=match.end(),
                )
            )

    return _remove_nested_duration_matches(_deduplicate(results))


# ============================================================
# DURATIONS
# ============================================================

DURATION_UNITS = {
    # Arabic
    "ثانية": "second",
    "ثواني": "second",
    "ثوان": "second",
    "دقيقة": "minute",
    "دقائق": "minute",
    "ساعة": "hour",
    "ساعات": "hour",
    "يوم": "day",
    "أيام": "day",
    "ايام": "day",
    "أسبوع": "week",
    "أسابيع": "week",
    "اسبوع": "week",
    "اسابيع": "week",
    "شهر": "month",
    "أشهر": "month",
    "اشهر": "month",
    "سنة": "year",
    "سنوات": "year",
    "عام": "year",
    "أعوام": "year",
    "اعوام": "year",

    # English
    "second": "second",
    "seconds": "second",
    "minute": "minute",
    "minutes": "minute",
    "hour": "hour",
    "hours": "hour",
    "day": "day",
    "days": "day",
    "week": "week",
    "weeks": "week",
    "month": "month",
    "months": "month",
    "year": "year",
    "years": "year",

    # French
    "seconde": "second",
    "secondes": "second",
    "minute": "minute",
    "minutes": "minute",
    "heure": "hour",
    "heures": "hour",
    "jour": "day",
    "jours": "day",
    "semaine": "week",
    "semaines": "week",
    "mois": "month",
    "an": "year",
    "ans": "year",
    "année": "year",
    "années": "year",
}


ENGLISH_NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
}


ARABIC_NUMBER_WORDS = {
    "صفر": 0,
    "واحد": 1,
    "واحدة": 1,
    "اثنان": 2,
    "اثنين": 2,
    "اثنتان": 2,
    "اثنتين": 2,
    "ثلاثة": 3,
    "ثلاث": 3,
    "اربعة": 4,
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
    "تسعة": 9,
    "تسع": 9,
    "عشرة": 10,
    "عشر": 10,
    "أحد عشر": 11,
    "اثنا عشر": 12,
    "اثني عشر": 12,
    "ثلاثة عشر": 13,
    "اربعة عشر": 14,
    "أربعة عشر": 14,
    "خمسة عشر": 15,
    "ستة عشر": 16,
    "سبعة عشر": 17,
    "ثمانية عشر": 18,
    "تسعة عشر": 19,
    "عشرون": 20,
}


def _parse_number(value: str) -> Optional[float]:
    """
    Parse numeric digits or a limited set of Arabic number words.
    """

    value = _clean_text(value)
    value = _normalize_digits(value)

    try:
        return float(value)
    except ValueError:
        pass

    normalized = normalize_temporal_text(value)

    if normalized in ARABIC_NUMBER_WORDS:
        return float(ARABIC_NUMBER_WORDS[normalized])

    return None



# Arabic contextual / dual duration forms.
# These are lexical forms where the number and unit are fused,
# e.g. يومين = 2 days, سنتين = 2 years.
ARABIC_COMPOUND_DURATIONS = {
    "يومين": (2.0, "day"),
    "أسبوعين": (2.0, "week"),
    "اسبوعين": (2.0, "week"),
    "شهرين": (2.0, "month"),
    "سنتين": (2.0, "year"),
    "عامين": (2.0, "year"),
}

# Arabic contextual duration markers.
# The marker determines the temporal direction, while the duration
# itself remains the structured TemporalExpression.
ARABIC_DURATION_CONTEXT = (
    ("بعد", "future"),
    ("في غضون", "future"),
    ("خلال", "future"),
    ("منذ", "past"),
    ("قبل", "past"),
)



def _remove_nested_duration_matches(
    results: List[TemporalExpression],
) -> List[TemporalExpression]:
    """
    Remove shorter duration expressions contained inside a longer
    equivalent duration expression.

    Examples:
        "بعد يوم واحد"   -> keep "يوم واحد"
        "بعد أسبوع واحد" -> keep "أسبوع واحد"
    """
    if not results:
        return results

    # Longest expressions first.
    ordered = sorted(
        results,
        key=lambda item: (
            -(item.end - item.start),
            -item.confidence,
            item.start,
        ),
    )

    kept: List[TemporalExpression] = []

    for current in ordered:
        nested = False

        for existing in kept:
            same_semantics = (
                existing.kind == current.kind
                and existing.value == current.value
                and existing.unit == current.unit
                and existing.direction == current.direction
            )

            contains = (
                existing.start <= current.start
                and existing.end >= current.end
            )

            strictly_longer = (
                (existing.end - existing.start)
                > (current.end - current.start)
            )

            if same_semantics and contains and strictly_longer:
                nested = True
                break

        if not nested:
            kept.append(current)

    return sorted(
        kept,
        key=lambda item: (item.start, item.end),
    )


def detect_durations(text: Any) -> List[TemporalExpression]:
    """
    Detect numeric and word-based durations in Arabic, English and French.

    Direction is inferred from the surrounding temporal context:
      - بعد / خلال / في غضون -> future
      - منذ / قبل -> past
      - after / in / within -> future
      - ago / before / since -> past
      - après / dans -> future
      - il y a / avant / depuis -> past
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    results: List[TemporalExpression] = []

    # ------------------------------------------------------------
    # Direction helpers
    # ------------------------------------------------------------
    def infer_direction(start: int, end: int) -> Optional[str]:
        # Look immediately before the duration.
        prefix = normalized[max(0, start - 40):start].strip()

        # Arabic
        arabic_future = (
            "بعد",
            "خلال",
            "في غضون",
        )
        arabic_past = (
            "منذ",
            "قبل",
        )

        for marker in sorted(arabic_future, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "future"

        for marker in sorted(arabic_past, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "past"

        # English
        english_future = (
            "after",
            "in",
            "within",
        )
        english_past = (
            "ago",
            "before",
            "since",
        )

        for marker in sorted(english_future, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "future"

        for marker in sorted(english_past, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "past"

        # French
        french_future = (
            "après",
            "apres",
            "dans",
        )
        french_past = (
            "il y a",
            "avant",
            "depuis",
        )

        for marker in sorted(french_future, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "future"

        for marker in sorted(french_past, key=len, reverse=True):
            if re.search(rf"(?<!\w){re.escape(marker)}\s*$", prefix):
                return "past"

        # Special English post-position marker:
        # "two days ago"
        suffix = normalized[end:end + 20].strip()

        if re.search(r"^(?:ago)\b", suffix):
            return "past"

        if re.search(r"^(?:before)\b", suffix):
            return "past"

        return None

    # ------------------------------------------------------------
    # Numeric durations
    # ------------------------------------------------------------
    number_pattern = (
        r"(?P<number>\d+(?:[.,]\d+)?)\s*"
        r"(?P<unit>"
        + "|".join(
            sorted(
                (
                    re.escape(normalize_temporal_text(unit))
                    for unit in DURATION_UNITS
                ),
                key=len,
                reverse=True,
            )
        )
        + r")"
    )

    for match in re.finditer(
        number_pattern,
        normalized,
        flags=re.IGNORECASE,
    ):
        number = _parse_number(match.group("number"))
        unit_raw = match.group("unit")

        unit = None

        for unit_key, unit_value in DURATION_UNITS.items():
            if normalize_temporal_text(unit_key) == unit_raw:
                unit = unit_value
                break

        if number is None or unit is None:
            continue

        direction = infer_direction(match.start(), match.end())

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="duration",
                value=number,
                unit=unit,
                direction=direction,
                confidence=0.97 if direction else 0.95,
                start=match.start(),
                end=match.end(),
            )
        )

    # ------------------------------------------------------------
    # Word-based durations
    # ------------------------------------------------------------
    number_sets = (
        ARABIC_NUMBER_WORDS,
        ENGLISH_NUMBER_WORDS,
        {
            "zéro": 0,
            "zero": 0,
            "un": 1,
            "une": 1,
            "deux": 2,
            "trois": 3,
            "quatre": 4,
            "cinq": 5,
            "six": 6,
            "sept": 7,
            "huit": 8,
            "neuf": 9,
            "dix": 10,
            "onze": 11,
            "douze": 12,
            "treize": 13,
            "quatorze": 14,
            "quinze": 15,
            "seize": 16,
            "dix-sept": 17,
            "dix-huit": 18,
            "dix-neuf": 19,
            "vingt": 20,
        },
    )

    # Longer number phrases first.
    for number_words in number_sets:
        for number_word, number in sorted(
            number_words.items(),
            key=lambda item: len(item[0]),
            reverse=True,
        ):
            number_normalized = normalize_temporal_text(number_word)

            for unit_word, unit in DURATION_UNITS.items():
                unit_normalized = normalize_temporal_text(unit_word)

                pattern = (
                    rf"(?<!\w)"
                    rf"{re.escape(number_normalized)}"
                    rf"\s+"
                    rf"{re.escape(unit_normalized)}"
                    rf"(?!\w)"
                )

                for match in re.finditer(
                    pattern,
                    normalized,
                    flags=re.IGNORECASE,
                ):
                    direction = infer_direction(
                        match.start(),
                        match.end(),
                    )

                    results.append(
                        TemporalExpression(
                            text=original[match.start():match.end()],
                            normalized=match.group(0),
                            kind="duration",
                            value=float(number),
                            unit=unit,
                            direction=direction,
                            confidence=0.97 if direction else 0.94,
                            start=match.start(),
                            end=match.end(),
                        )
                    )

    # ------------------------------------------------------------
    # Implicit singular durations
    # ------------------------------------------------------------
    # Arabic:
    #   يوم / أسبوع / شهر / سنة
    #
    # English:
    #   day / week / month / year
    #
    # French:
    #   jour / semaine / mois / an / année
    #
    # A bare temporal unit in a duration context has value = 1.
    singular_duration_units = {
        # Arabic
        "يوم": "day",
        "أسبوع": "week",
        "اسبوع": "week",
        "شهر": "month",
        "سنة": "year",
        "عام": "year",
        "ساعة": "hour",
        "دقيقة": "minute",
        "ثانية": "second",

        # English
        "day": "day",
        "week": "week",
        "month": "month",
        "year": "year",
        "hour": "hour",
        "minute": "minute",
        "second": "second",

        # French
        "jour": "day",
        "semaine": "week",
        "mois": "month",
        "an": "year",
        "année": "year",
        "heure": "hour",
        "minute": "minute",
        "seconde": "second",
    }

    # Only treat a singular unit as a duration when it has
    # an explicit temporal-direction marker.
    direction_context_pattern = (
        r"(?P<marker>"
        r"بعد|في\s+غضون|خلال|منذ|قبل|"
        r"after|in|within|before|since|"
        r"après|apres|dans|avant|depuis"
        r")"
        r"\s+"
        r"(?P<unit>"
        + "|".join(
            sorted(
                (
                    re.escape(normalize_temporal_text(unit))
                    for unit in singular_duration_units
                ),
                key=len,
                reverse=True,
            )
        )
        + r")"
        r"\b"
    )

    for match in re.finditer(
        direction_context_pattern,
        normalized,
        flags=re.IGNORECASE,
    ):
        unit_raw = match.group("unit")

        unit = None
        for unit_key, unit_value in singular_duration_units.items():
            if normalize_temporal_text(unit_key) == unit_raw:
                unit = unit_value
                break

        if unit is None:
            continue

        unit_start = match.start("unit")
        unit_end = match.end("unit")

        direction = infer_direction(unit_start, unit_end)

        results.append(
            TemporalExpression(
                text=original[unit_start:unit_end],
                normalized=match.group("unit"),
                kind="duration",
                value=1.0,
                unit=unit,
                direction=direction,
                confidence=0.96 if direction else 0.94,
                start=unit_start,
                end=unit_end,
            )
        )

    # ------------------------------------------------------------
    # "unit واحد" / "unit one"
    # ------------------------------------------------------------
    # Examples:
    #   بعد يوم واحد
    #   بعد أسبوع واحد
    #   in one week
    #   dans une semaine
    #
    # This is handled explicitly so the detector returns the
    # complete duration instead of a duplicate bare unit.

    one_duration_pattern = (
        r"(?P<unit>"
        + "|".join(
            sorted(
                (
                    re.escape(normalize_temporal_text(unit))
                    for unit in singular_duration_units
                ),
                key=len,
                reverse=True,
            )
        )
        + r")"
        r"\s+"
        r"(?P<one>"
        r"واحد|واحدة|"
        r"one|"
        r"un|une"
        r")"
        r"\b"
    )

    for match in re.finditer(
        one_duration_pattern,
        normalized,
        flags=re.IGNORECASE,
    ):
        unit_raw = match.group("unit")

        unit = None
        for unit_key, unit_value in singular_duration_units.items():
            if normalize_temporal_text(unit_key) == unit_raw:
                unit = unit_value
                break

        if unit is None:
            continue

        direction = infer_direction(
            match.start(),
            match.end(),
        )

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="duration",
                value=1.0,
                unit=unit,
                direction=direction,
                confidence=0.97 if direction else 0.94,
                start=match.start(),
                end=match.end(),
            )
        )

    # ------------------------------------------------------------
    # Arabic dual forms
    # ------------------------------------------------------------
    # Examples:
    #   يومين
    #   أسبوعين
    #   شهرين
    #   سنتين
    dual_units = {
        "يومين": ("day", 2),
        "اسبوعين": ("week", 2),
        "أسبوعين": ("week", 2),
        "شهرين": ("month", 2),
        "سنتين": ("year", 2),
        "عامين": ("year", 2),
        "ساعتين": ("hour", 2),
        "دقيقتين": ("minute", 2),
        "ثانيتين": ("second", 2),
    }

    for unit_text, (unit, number) in dual_units.items():
        normalized_unit = normalize_temporal_text(unit_text)

        pattern = rf"(?<!\w){re.escape(normalized_unit)}(?!\w)"

        for match in re.finditer(pattern, normalized):
            direction = infer_direction(
                match.start(),
                match.end(),
            )

            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind="duration",
                    value=float(number),
                    unit=unit,
                    direction=direction,
                    confidence=0.97 if direction else 0.95,
                    start=match.start(),
                    end=match.end(),
                )
            )

    # ------------------------------------------------------------
    # Remove overlapping duplicate detections
    # ------------------------------------------------------------
    return _remove_nested_duration_matches(_deduplicate(results))

# ============================================================
# CLOCK / TIME
# ============================================================

def detect_clock_times(text: Any) -> List[TemporalExpression]:
    """
    Detect clock times:
    - 14:30
    - 9:15
    - 14h30
    - 9 AM
    - 5 PM
    - الساعة 8
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    results: List[TemporalExpression] = []

    # HH:MM / HH.MM
    for match in re.finditer(
        r"\b([01]?\d|2[0-3])[:.]([0-5]\d)\b",
        normalized,
    ):
        hour = int(match.group(1))
        minute = int(match.group(2))

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="clock_time",
                value={"hour": hour, "minute": minute},
                unit="minute",
                confidence=0.99,
                start=match.start(),
                end=match.end(),
            )
        )

    # HHhMM
    for match in re.finditer(
        r"\b([01]?\d|2[0-3])h([0-5]\d)\b",
        normalized,
    ):
        hour = int(match.group(1))
        minute = int(match.group(2))

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="clock_time",
                value={"hour": hour, "minute": minute},
                unit="minute",
                confidence=0.99,
                start=match.start(),
                end=match.end(),
            )
        )

    # AM / PM
    for match in re.finditer(
        r"\b(1[0-2]|0?[1-9])\s*(am|pm)\b",
        normalized,
        flags=re.IGNORECASE,
    ):
        hour = int(match.group(1))
        period = match.group(2).lower()

        if period == "pm" and hour != 12:
            hour += 12
        elif period == "am" and hour == 12:
            hour = 0

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="clock_time",
                value={"hour": hour, "minute": 0},
                unit="minute",
                confidence=0.98,
                start=match.start(),
                end=match.end(),
            )
        )

    # Arabic "الساعة 8"
    for match in re.finditer(
        r"(?:الساعة|ساعه)\s+(\d{1,2})(?:\s*[:.]\s*(\d{2}))?",
        normalized,
    ):
        hour = int(match.group(1))
        minute = int(match.group(2) or 0)

        if 0 <= hour <= 23 and 0 <= minute <= 59:
            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind="clock_time",
                    value={"hour": hour, "minute": minute},
                    unit="minute",
                    confidence=0.96,
                    start=match.start(),
                    end=match.end(),
                )
            )

    return _deduplicate(results)


# ============================================================
# CALENDAR DATES
# ============================================================

def _month_from_name(name: str) -> Optional[int]:
    normalized = normalize_temporal_text(name)

    if normalized in ARABIC_MONTHS:
        return ARABIC_MONTHS[normalized]

    if normalized in ENGLISH_MONTHS:
        return ENGLISH_MONTHS[normalized]

    if normalized in FRENCH_MONTHS:
        return FRENCH_MONTHS[normalized]

    return None


def detect_numeric_dates(text: Any) -> List[TemporalExpression]:
    """
    Detect common numeric dates.

    Examples:
    - 2026-08-14
    - 14/08/2026
    - 14-08-2026
    - 14.08.2026
    """

    original = _clean_text(text)
    normalized = _normalize_digits(original)

    results: List[TemporalExpression] = []

    # ISO YYYY-MM-DD
    for match in re.finditer(
        r"\b(20\d{2})[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12]\d|3[01])\b",
        normalized,
    ):
        year = int(match.group(1))
        month = int(match.group(2))
        day = int(match.group(3))

        if _valid_date(year, month, day):
            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind="calendar_date",
                    value={
                        "year": year,
                        "month": month,
                        "day": day,
                    },
                    confidence=0.99,
                    start=match.start(),
                    end=match.end(),
                )
            )

    # DD/MM/YYYY
    for match in re.finditer(
        r"\b(0?[1-9]|[12]\d|3[01])[-/.](0?[1-9]|1[0-2])[-/.](20\d{2})\b",
        normalized,
    ):
        day = int(match.group(1))
        month = int(match.group(2))
        year = int(match.group(3))

        if _valid_date(year, month, day):
            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind="calendar_date",
                    value={
                        "year": year,
                        "month": month,
                        "day": day,
                    },
                    confidence=0.98,
                    start=match.start(),
                    end=match.end(),
                )
            )

    return _deduplicate(results)


def detect_named_dates(text: Any) -> List[TemporalExpression]:
    """
    Detect:
    - 15 August 2026
    - 15 أغسطس 2026
    - 15 août 2026
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    month_names = set()

    for source in (
        ARABIC_MONTHS,
        ENGLISH_MONTHS,
        FRENCH_MONTHS,
    ):
        month_names.update(source.keys())

    month_pattern = "|".join(
        sorted(
            (
                re.escape(normalize_temporal_text(name))
                for name in month_names
            ),
            key=len,
            reverse=True,
        )
    )

    results: List[TemporalExpression] = []

    pattern = (
        rf"\b(?P<day>0?[1-9]|[12]\d|3[01])"
        rf"\s+(?P<month>{month_pattern})"
        rf"(?:\s+(?P<year>20\d{{2}}))?\b"
    )

    for match in re.finditer(pattern, normalized):
        day = int(match.group("day"))
        month = _month_from_name(match.group("month"))

        year_raw = match.group("year")
        year = int(year_raw) if year_raw else None

        if month is None:
            continue

        if year is not None and not _valid_date(year, month, day):
            continue

        results.append(
            TemporalExpression(
                text=original[match.start():match.end()],
                normalized=match.group(0),
                kind="calendar_date",
                value={
                    "year": year,
                    "month": month,
                    "day": day,
                },
                confidence=0.97,
                start=match.start(),
                end=match.end(),
            )
        )

    return _deduplicate(results)


# ============================================================
# WEEKDAYS
# ============================================================

def detect_weekdays(text: Any) -> List[TemporalExpression]:
    """
    Detect weekday names.
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    results: List[TemporalExpression] = []

    for weekday, index in WEEKDAYS.items():
        normalized_weekday = normalize_temporal_text(weekday)

        pattern = rf"\b{re.escape(normalized_weekday)}\b"

        for match in re.finditer(pattern, normalized):
            results.append(
                TemporalExpression(
                    text=original[match.start():match.end()],
                    normalized=match.group(0),
                    kind="weekday",
                    value=index,
                    unit="weekday",
                    confidence=0.97,
                    start=match.start(),
                    end=match.end(),
                )
            )

    return _deduplicate(results)


# ============================================================
# TEMPORAL QUESTION DETECTION
# ============================================================

TEMPORAL_QUESTION_MARKERS = (
    # Arabic
    "متى",
    "موعد إطلاق",
    "موعد البدء",
    "موعد بداية",
    "تاريخ إطلاق",
    "تاريخ البدء",
    "تاريخ البداية",
    "موعد المشروع",
    "متى حدث",
    "متى يحدث",
    "متى سيحدث",
    "متى تم",
    "متى بدأ",
    "متى بدأ",
    "متى ينتهي",
    "كم من الوقت",
    "كم يستغرق",
    "منذ متى",
    "إلى متى",
    "الى متى",
    "أي يوم",
    "اي يوم",
    "أي تاريخ",
    "اي تاريخ",
    "أي سنة",
    "اي سنة",
    "أي شهر",
    "اي شهر",

    # English
    "when",
    "what date",
    "which date",
    "what year",
    "which year",
    "what day",
    "which day",
    "how long",
    "since when",
    "until when",

    # French
    "quand",
    "quelle date",
    "quel jour",
    "quelle année",
    "date de lancement",
    "date de début",
    "date de commencement",
    "date du projet",
    "début du projet",
    "lancement du projet",
    "quel mois",
    "combien de temps",
    "depuis quand",
    "jusqu'à quand",
)


def detect_temporal_question(text: Any) -> Dict[str, Any]:
    """
    Determine whether the text is asking a temporal question.

    IMPORTANT:
    A temporal expression alone is NOT a temporal question.

    Examples:
        "15 August 2026" -> temporal information, NOT a question
        "14:30"           -> temporal information, NOT a question
        "tomorrow"        -> temporal information, NOT a question
        "When did QAI start?" -> temporal question
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    matches: List[str] = []

    for marker in TEMPORAL_QUESTION_MARKERS:
        marker_normalized = normalize_temporal_text(marker)

        # Word/phrase boundary matching instead of raw substring matching.
        pattern = rf"(?<!\w){re.escape(marker_normalized)}(?!\w)"

        if re.search(pattern, normalized, flags=re.IGNORECASE):
            matches.append(marker)

    expressions = detect_temporal_expressions(original)

    return {
        # Expressions alone do NOT make the input a question.
        "is_temporal_question": bool(matches),
        "markers": matches,
        "expressions": [
            item.to_dict()
            for item in expressions
        ],
        "confidence": (
            0.98
            if matches
            else 0.0
        ),
    }



def _apply_relative_duration_context(
    text: Any,
    expression: TemporalExpression,
) -> TemporalExpression:
    """
    Infer temporal direction from the context surrounding a duration.

    Examples:
        بعد خمسة أيام        -> future
        بعد 3 أيام           -> future
        منذ ثلاث سنوات       -> past
        قبل أسبوع            -> past
        three years ago      -> past
        after two weeks      -> future
        before two weeks     -> past

    A duration without contextual direction remains unchanged.
    """

    original = _clean_text(text)
    normalized = normalize_temporal_text(original)

    if expression.kind != "duration":
        return expression

    start = expression.start
    end = expression.end

    if start < 0 or end < 0:
        return expression

    # Context immediately before the duration.
    before = normalized[:start].strip()

    # Context immediately after the duration.
    after = normalized[end:].strip()

    future_markers = (
        # Arabic
        "بعد",
        "بعدها",
        "في",
        "خلال",
        "لاحقا",
        "لاحقاً",

        # English
        "after",
        "in",
        "within",
        "later",
    )

    past_markers = (
        # Arabic
        "منذ",
        "قبل",

        # English
        "ago",
        "before",

        # French
        "il y a",
        "depuis",
        "avant",
    )

    # French future patterns:
    # dans deux semaines
    french_future_markers = (
        "dans",
    )

    # French past patterns:
    # il y a cinq ans
    french_past_markers = (
        "il y a",
        "depuis",
    )

    direction = expression.direction

    # --------------------------------------------------------
    # Arabic / English / generic prefix context
    # --------------------------------------------------------

    for marker in future_markers:
        if re.search(
            rf"(?<!\w){re.escape(marker)}\s*$",
            before,
            flags=re.IGNORECASE,
        ):
            direction = "future"
            break

    if direction is None:
        for marker in past_markers:
            if re.search(
                rf"(?<!\w){re.escape(marker)}\s*$",
                before,
                flags=re.IGNORECASE,
            ):
                direction = "past"
                break

    # --------------------------------------------------------
    # French
    # --------------------------------------------------------

    if direction is None:
        for marker in french_future_markers:
            if re.search(
                rf"(?<!\w){re.escape(marker)}\s*$",
                before,
                flags=re.IGNORECASE,
            ):
                direction = "future"
                break

    if direction is None:
        for marker in french_past_markers:
            if re.search(
                rf"(?<!\w){re.escape(marker)}\s*$",
                before,
                flags=re.IGNORECASE,
            ):
                direction = "past"
                break

    # --------------------------------------------------------
    # English suffix:
    # "three years ago"
    # --------------------------------------------------------

    if direction is None:
        if re.match(
            r"^(?:ago)\b",
            after,
            flags=re.IGNORECASE,
        ):
            direction = "past"

    # --------------------------------------------------------
    # If no contextual direction was found, preserve original.
    # --------------------------------------------------------

    if direction == expression.direction:
        return expression

    return TemporalExpression(
        text=expression.text,
        normalized=expression.normalized,
        kind=expression.kind,
        value=expression.value,
        unit=expression.unit,
        direction=direction,
        confidence=expression.confidence,
        start=expression.start,
        end=expression.end,
    )


# ============================================================
# TEMPORAL EXPRESSION AGGREGATION
# ============================================================

def detect_temporal_expressions(
    text: Any,
) -> List[TemporalExpression]:
    """
    Detect all supported temporal expressions.
    """

    original = _clean_text(text)

    if not original:
        return []

    results: List[TemporalExpression] = []

    detectors = (
        detect_relative_time,
        detect_durations,
        detect_clock_times,
        detect_numeric_dates,
        detect_named_dates,
        detect_weekdays,
    )

    for detector in detectors:
        try:
            detected = detector(original)

            # Apply contextual direction to duration expressions
            # before aggregation/deduplication.
            if detector is detect_durations:
                detected = [
                    _apply_relative_duration_context(original, expression)
                    for expression in detected
                ]

            results.extend(detected)

        except Exception:
            # Understanding must remain resilient.
            continue

    results = _deduplicate(results)

    # Prefer longer expressions when spans overlap.
    results.sort(
        key=lambda item: (
            item.start if item.start >= 0 else 10**9,
            -(item.end - item.start)
            if item.start >= 0 and item.end >= 0
            else 0,
            -item.confidence,
        )
    )

    return results


# ============================================================
# TEMPORAL CLASSIFICATION
# ============================================================

def classify_temporal_expression(
    expression: TemporalExpression,
) -> str:
    """
    Map an expression to a broad temporal class.
    """

    kind = expression.kind

    if kind.startswith("relative"):
        return "relative"

    if kind == "duration":
        return "duration"

    if kind == "clock_time":
        return "time_of_day"

    if kind == "calendar_date":
        return "date"

    if kind == "weekday":
        return "weekday"

    return "unknown"


def temporal_profile(text: Any) -> Dict[str, Any]:
    """
    Build a complete temporal profile for a piece of text.
    """

    original = _clean_text(text)

    expressions = detect_temporal_expressions(original)

    relative = []
    dates = []
    times = []
    durations = []
    weekdays = []

    for expression in expressions:
        category = classify_temporal_expression(expression)

        if category == "relative":
            relative.append(expression.to_dict())

        elif category == "date":
            dates.append(expression.to_dict())

        elif category == "time_of_day":
            times.append(expression.to_dict())

        elif category == "duration":
            durations.append(expression.to_dict())

        elif category == "weekday":
            weekdays.append(expression.to_dict())

    question_info = detect_temporal_question(original)

    return {
        "text": original,
        "has_temporal_information": bool(expressions),
        "is_temporal_question": question_info["is_temporal_question"],
        "confidence": (
            max(
                (
                    expression.confidence
                    for expression in expressions
                ),
                default=0.0,
            )
        ),
        "expressions": [
            expression.to_dict()
            for expression in expressions
        ],
        "relative": relative,
        "dates": dates,
        "times": times,
        "durations": durations,
        "weekdays": weekdays,
        "question_markers": question_info["markers"],
    }


# ============================================================
# REFERENCE RESOLUTION
# ============================================================

def resolve_relative_date(
    expression: TemporalExpression,
    reference: Optional[date] = None,
) -> Optional[date]:
    """
    Resolve simple relative day/week/month/year expressions.

    This function intentionally avoids pretending that months
    have a fixed duration.
    """

    if reference is None:
        reference = date.today()

    if expression.kind == "relative_day":
        try:
            offset = int(expression.value or 0)
        except (TypeError, ValueError):
            return None

        return reference + timedelta(days=offset)

    if expression.kind == "relative_week":
        try:
            offset = int(expression.value or 0)
        except (TypeError, ValueError):
            return None

        return reference + timedelta(weeks=offset)

    if expression.kind == "relative_month":
        try:
            offset = int(expression.value or 0)
        except (TypeError, ValueError):
            return None

        return _add_months(reference, offset)

    if expression.kind == "relative_year":
        try:
            offset = int(expression.value or 0)
        except (TypeError, ValueError):
            return None

        return _add_months(reference, offset * 12)

    return None


def _add_months(value: date, months: int) -> date:
    """
    Add calendar months safely.
    """

    total = value.year * 12 + (value.month - 1) + months

    year = total // 12
    month = total % 12 + 1

    day = min(
        value.day,
        _days_in_month(year, month),
    )

    return date(year, month, day)


def _days_in_month(year: int, month: int) -> int:
    if month == 12:
        next_month = date(year + 1, 1, 1)
    else:
        next_month = date(year, month + 1, 1)

    return (next_month - timedelta(days=1)).day


def _valid_date(year: int, month: int, day: int) -> bool:
    try:
        date(year, month, day)
        return True
    except ValueError:
        return False


# ============================================================
# TEMPORAL RANGE
# ============================================================

def duration_to_timedelta(
    expression: TemporalExpression,
) -> Optional[timedelta]:
    """
    Convert fixed-size duration expressions into timedelta.

    Months and years are deliberately excluded because they are
    calendar-dependent.
    """

    if expression.kind != "duration":
        return None

    try:
        value = float(expression.value)
    except (TypeError, ValueError):
        return None

    unit = expression.unit

    factors = {
        "second": timedelta(seconds=value),
        "minute": timedelta(minutes=value),
        "hour": timedelta(hours=value),
        "day": timedelta(days=value),
        "week": timedelta(weeks=value),
    }

    return factors.get(unit)


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def has_temporal_information(text: Any) -> bool:
    """
    Return True when temporal expressions are detected.
    """

    return bool(detect_temporal_expressions(text))


def is_temporal_question(text: Any) -> bool:
    """
    Return True when the text appears to request temporal information.
    """

    return bool(
        detect_temporal_question(text).get(
            "is_temporal_question"
        )
    )


def extract_temporal_texts(text: Any) -> List[str]:
    """
    Return only the detected surface expressions.
    """

    return [
        expression.text
        for expression in detect_temporal_expressions(text)
    ]


def _deduplicate(
    expressions: Iterable[TemporalExpression],
) -> List[TemporalExpression]:
    """
    Remove exact duplicate detections.
    """

    seen = set()
    result: List[TemporalExpression] = []

    for expression in expressions:
        key = (
            expression.start,
            expression.end,
            expression.normalized,
            expression.kind,
            str(expression.value),
            expression.unit,
        )

        if key in seen:
            continue

        seen.add(key)
        result.append(expression)

    return result


# ============================================================
# MAIN PUBLIC API
# ============================================================

def analyze_temporal(text: Any) -> Dict[str, Any]:
    """
    Main public entry point for the temporal understanding layer.

    Returns a stable dictionary suitable for later integration
    with question_parser.py, context.py, and the Brain pipeline.
    """

    return temporal_profile(text)


def parse_temporal(text: Any) -> Dict[str, Any]:
    """
    Alias for analyze_temporal().
    """

    return analyze_temporal(text)


# ============================================================
# CLASS WRAPPER
# ============================================================

class TemporalAnalyzer:
    """
    Object-oriented wrapper around the deterministic API.

    This makes the module easy to integrate later without
    forcing any current project architecture to change.
    """

    version = "1.0"

    def normalize(self, text: Any) -> str:
        return normalize_temporal_text(text)

    def detect(self, text: Any) -> List[Dict[str, Any]]:
        return [
            expression.to_dict()
            for expression in detect_temporal_expressions(text)
        ]

    def analyze(self, text: Any) -> Dict[str, Any]:
        return analyze_temporal(text)

    def is_temporal_question(self, text: Any) -> bool:
        return is_temporal_question(text)

    def resolve(
        self,
        expression: TemporalExpression,
        reference: Optional[date] = None,
    ) -> Optional[date]:
        return resolve_relative_date(
            expression,
            reference=reference,
        )


temporal = TemporalAnalyzer()


__all__ = [
    "TemporalExpression",
    "TemporalAnalyzer",
    "temporal",
    "normalize_temporal_text",
    "detect_relative_time",
    "detect_durations",
    "detect_clock_times",
    "detect_numeric_dates",
    "detect_named_dates",
    "detect_weekdays",
    "detect_temporal_question",
    "detect_temporal_expressions",
    "classify_temporal_expression",
    "temporal_profile",
    "resolve_relative_date",
    "duration_to_timedelta",
    "has_temporal_information",
    "is_temporal_question",
    "extract_temporal_texts",
    "analyze_temporal",
    "parse_temporal",
]

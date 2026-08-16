from __future__ import annotations

import re
import unicodedata
from typing import Iterable, List


_ARABIC_DIACRITICS_RE = re.compile(
    r"[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]"
)

_ZERO_WIDTH_RE = re.compile(r"[\u200B-\u200D\uFEFF]")

_WHITESPACE_RE = re.compile(r"\s+")

_TATWEEL = "\u0640"

_ARABIC_LETTER_MAP = str.maketrans(
    {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",
        "ٱ": "ا",
        "ى": "ي",
        "ؤ": "و",
        "ئ": "ي",
        "ة": "ه",
    }
)

_DIGIT_MAP = str.maketrans(
    "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹",
    "01234567890123456789",
)

_QUOTE_MAP = str.maketrans(
    {
        "“": '"',
        "”": '"',
        "„": '"',
        "‟": '"',
        "‘": "'",
        "’": "'",
        "‚": "'",
        "‛": "'",
    }
)

_DASH_MAP = str.maketrans(
    {
        "–": "-",
        "—": "-",
        "―": "-",
        "−": "-",
        "-": "-",
    }
)


def remove_zero_width(text: str) -> str:
    """Remove zero-width and invisible formatting characters."""
    return _ZERO_WIDTH_RE.sub("", str(text or ""))


def normalize_spaces(text: str) -> str:
    """Collapse repeated whitespace and trim the text."""
    return _WHITESPACE_RE.sub(" ", str(text or "")).strip()


def normalize_arabic_letters(text: str) -> str:
    """Normalize common Arabic letter variants for matching."""
    return str(text or "").translate(_ARABIC_LETTER_MAP)


def remove_arabic_diacritics(text: str) -> str:
    """Remove Arabic vowel marks and Quranic annotation marks."""
    return _ARABIC_DIACRITICS_RE.sub("", str(text or ""))


def remove_tatweel(text: str) -> str:
    """Remove Arabic kashida/tatweel characters."""
    return str(text or "").replace(_TATWEEL, "")


def normalize_quotes(text: str) -> str:
    """Normalize typographic quotation marks."""
    return str(text or "").translate(_QUOTE_MAP)


def normalize_dashes(text: str) -> str:
    """Normalize Unicode dash variants to a simple hyphen."""
    return str(text or "").translate(_DASH_MAP)


def normalize_digits(text: str) -> str:
    """Convert Arabic-Indic and Persian digits to ASCII digits."""
    return str(text or "").translate(_DIGIT_MAP)


def normalize_punctuation(text: str) -> str:
    """
    Normalize punctuation variants while preserving semantic punctuation.

    This intentionally does not remove punctuation because question
    boundaries and sentence structure can be useful to later layers.
    """
    text = str(text or "")
    text = text.replace("؟", "?")
    text = text.replace("؛", ";")
    text = text.replace("،", ",")
    text = text.replace("…", "...")
    return text


def normalize_case(text: str) -> str:
    """Case-fold Latin text while leaving Arabic unaffected."""
    return str(text or "").casefold()


def normalize_line_breaks(text: str) -> str:
    """Convert line breaks and tabs into ordinary spaces."""
    text = str(text or "")
    return re.sub(r"[\r\n\t]+", " ", text)


def normalize_for_matching(text: str) -> str:
    """
    Conservative normalization intended for semantic/string matching.

    It removes formatting noise and common orthographic variation without
    aggressively stemming or deleting meaningful words.
    """
    text = str(text or "")

    text = unicodedata.normalize("NFKC", text)
    text = remove_zero_width(text)
    text = normalize_line_breaks(text)
    text = remove_tatweel(text)
    text = remove_arabic_diacritics(text)
    text = normalize_arabic_letters(text)
    text = normalize_quotes(text)
    text = normalize_dashes(text)
    text = normalize_digits(text)
    text = normalize_punctuation(text)
    text = normalize_case(text)
    text = normalize_spaces(text)

    return text


def normalize_text(text: str) -> str:
    """Public general-purpose normalization entry point."""
    return normalize_for_matching(text)


def tokenize(text: str) -> List[str]:
    """Tokenize normalized text while retaining Arabic and Latin words."""
    normalized = normalize_for_matching(text)

    if not normalized:
        return []

    return re.findall(
        r"[A-Za-z\u0600-\u06FF0-9]+(?:['’_-][A-Za-z\u0600-\u06FF0-9]+)*",
        normalized,
    )


def word_tokens(text: str) -> List[str]:
    """Alias for tokenize(), kept explicit for higher-level modules."""
    return tokenize(text)


def unique_tokens(text: str) -> List[str]:
    """Return unique tokens in first-seen order."""
    seen = set()
    result = []

    for token in tokenize(text):
        if token not in seen:
            seen.add(token)
            result.append(token)

    return result


def normalized_tokens(text: str) -> List[str]:
    """Return normalized tokens."""
    return [normalize_for_matching(token) for token in tokenize(text)]


def arabic_character_count(text: str) -> int:
    """Count Arabic-script characters."""
    return sum(
        1
        for char in str(text or "")
        if "\u0600" <= char <= "\u06FF"
    )


def latin_character_count(text: str) -> int:
    """Count Latin alphabetic characters."""
    return sum(
        1
        for char in str(text or "")
        if ("a" <= char.lower() <= "z")
    )


def digit_count(text: str) -> int:
    """Count both Arabic and Latin digits."""
    return sum(
        1
        for char in str(text or "")
        if char.isdigit()
    )


def script_profile(text: str) -> dict:
    """Return simple script statistics useful to the language layer."""
    value = str(text or "")

    arabic = arabic_character_count(value)
    latin = latin_character_count(value)
    digits = digit_count(value)

    total_letters = arabic + latin

    if total_letters == 0:
        dominant = "unknown"
    elif arabic > latin:
        dominant = "arabic"
    elif latin > arabic:
        dominant = "latin"
    else:
        dominant = "mixed"

    return {
        "arabic_characters": arabic,
        "latin_characters": latin,
        "digits": digits,
        "letters": total_letters,
        "dominant_script": dominant,
        "has_arabic": arabic > 0,
        "has_latin": latin > 0,
        "has_digits": digits > 0,
    }


def normalized_equal(left: str, right: str) -> bool:
    """Compare two strings after conservative normalization."""
    return normalize_for_matching(left) == normalize_for_matching(right)


def contains_normalized(text: str, phrase: str) -> bool:
    """Check whether normalized phrase occurs in normalized text."""
    normalized_text = normalize_for_matching(text)
    normalized_phrase = normalize_for_matching(phrase)

    if not normalized_phrase:
        return False

    return normalized_phrase in normalized_text


def normalized_phrase_tokens(text: str) -> List[str]:
    """
    Return tokens suitable for phrase matching.

    Unlike unique_tokens(), repeated words are preserved because repetition
    can carry useful information in a question.
    """
    return normalized_tokens(text)


def normalize_pipeline(
    text: str,
    *,
    lowercase: bool = True,
    normalize_numbers: bool = True,
) -> str:
    """
    Configurable normalization pipeline.

    The default remains conservative and is intended for understanding,
    retrieval, intent detection, and entity matching.
    """
    value = str(text or "")

    value = unicodedata.normalize("NFKC", value)
    value = remove_zero_width(value)
    value = normalize_line_breaks(value)
    value = remove_tatweel(value)
    value = remove_arabic_diacritics(value)
    value = normalize_arabic_letters(value)
    value = normalize_quotes(value)
    value = normalize_dashes(value)

    if normalize_numbers:
        value = normalize_digits(value)

    value = normalize_punctuation(value)

    if lowercase:
        value = normalize_case(value)

    value = normalize_spaces(value)

    return value


def clean_text(text: str) -> str:
    """Compatibility-oriented public cleaning helper."""
    return normalize_pipeline(text)


def normalize_query(text: str) -> str:
    """Normalize a user query for downstream understanding/retrieval."""
    return normalize_pipeline(text)


def prepare_text(text: str) -> str:
    """Prepare arbitrary text for downstream QAI processing."""
    return normalize_pipeline(text)


__all__ = [
    "remove_zero_width",
    "normalize_spaces",
    "normalize_arabic_letters",
    "remove_arabic_diacritics",
    "remove_tatweel",
    "normalize_quotes",
    "normalize_dashes",
    "normalize_digits",
    "normalize_punctuation",
    "normalize_case",
    "normalize_line_breaks",
    "normalize_for_matching",
    "normalize_text",
    "tokenize",
    "word_tokens",
    "unique_tokens",
    "normalized_tokens",
    "arabic_character_count",
    "latin_character_count",
    "digit_count",
    "script_profile",
    "normalized_equal",
    "contains_normalized",
    "normalized_phrase_tokens",
    "normalize_pipeline",
    "clean_text",
    "normalize_query",
    "prepare_text",
]

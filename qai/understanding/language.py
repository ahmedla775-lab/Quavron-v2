# -*- coding: utf-8 -*-
"""
QAI Understanding Layer
Universal Language Analysis

Standalone deterministic language/script analyzer.

Design principles:
- No external language-detection dependencies.
- No dependency on other QAI layers.
- Script detection is separated from language detection.
- Language detection is evidence-based and conservative.
- Unknown is preferred over false certainty.
- Mixed-language input is explicitly represented.
- Arabic dialect detection remains a specialized sub-layer.
- Existing public API is preserved for compatibility.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Any, Dict, List, Optional, Sequence, Tuple


# ============================================================================
# Unicode script ranges
# ============================================================================

_SCRIPT_RANGES = {
    "arabic": (
        ("\u0600", "\u06ff"),
        ("\u0750", "\u077f"),
        ("\u08a0", "\u08ff"),
        ("\ufb50", "\ufdff"),
        ("\ufe70", "\ufeff"),
    ),
    "latin": (
        ("A", "Z"),
        ("a", "z"),
        ("\u00c0", "\u024f"),
        ("\u1e00", "\u1eff"),
    ),
    "cyrillic": (
        ("\u0400", "\u04ff"),
        ("\u0500", "\u052f"),
    ),
    "hebrew": (
        ("\u0590", "\u05ff"),
    ),
    "greek": (
        ("\u0370", "\u03ff"),
        ("\u1f00", "\u1fff"),
    ),
    "devanagari": (
        ("\u0900", "\u097f"),
    ),
    "bengali": (
        ("\u0980", "\u09ff"),
    ),
    "gurmukhi": (
        ("\u0a00", "\u0a7f"),
    ),
    "gujarati": (
        ("\u0a80", "\u0aff"),
    ),
    "oriya": (
        ("\u0b00", "\u0b7f"),
    ),
    "tamil": (
        ("\u0b80", "\u0bff"),
    ),
    "telugu": (
        ("\u0c00", "\u0c7f"),
    ),
    "kannada": (
        ("\u0c80", "\u0cff"),
    ),
    "malayalam": (
        ("\u0d00", "\u0d7f"),
    ),
    "thai": (
        ("\u0e00", "\u0e7f"),
    ),
    "lao": (
        ("\u0e80", "\u0eff"),
    ),
    "georgian": (
        ("\u10a0", "\u10ff"),
    ),
    "armenian": (
        ("\u0530", "\u058f"),
    ),
    "hangul": (
        ("\u1100", "\u11ff"),
        ("\u3130", "\u318f"),
        ("\uac00", "\ud7af"),
    ),
    "hiragana": (
        ("\u3040", "\u309f"),
    ),
    "katakana": (
        ("\u30a0", "\u30ff"),
        ("\u31f0", "\u31ff"),
    ),
    "han": (
        ("\u3400", "\u4dbf"),
        ("\u4e00", "\u9fff"),
        ("\uf900", "\ufaff"),
    ),
}

_DIGIT_RANGES = (
    ("0", "9"),
    ("\u0660", "\u0669"),
    ("\u06f0", "\u06f9"),
)


# ============================================================================
# Language profiles
# ============================================================================

_LANGUAGE_MARKERS = {
    "en": {
        "the", "is", "are", "what", "who", "where", "when", "why",
        "how", "which", "can", "could", "would", "should", "please",
        "about", "with", "from", "for", "this", "that", "and", "or",
        "not", "yes", "no", "artificial", "intelligence", "system",
        "working", "work", "function", "does", "do", "using",
    },
    "fr": {
        "le", "la", "les", "un", "une", "des", "est", "sont", "que",
        "qui", "quoi", "où", "quand", "pourquoi", "comment", "avec",
        "dans", "pour", "sur", "et", "ou", "pas", "oui", "non",
        "bonjour", "merci", "système", "fonctionne", "fonctionner",
        "intelligence", "artificielle", "comment", "quel", "quelle",
    },
    "de": {
        "der", "die", "das", "ein", "eine", "ist", "sind", "und",
        "oder", "nicht", "was", "wer", "wo", "wann", "warum", "wie",
        "mit", "für", "von", "zu", "den", "dem", "künstliche",
        "intelligenz", "system",
    },
    "es": {
        "el", "la", "los", "las", "un", "una", "es", "son", "que",
        "qué", "quién", "dónde", "cuando", "cuándo", "por", "porqué",
        "porqué", "cómo", "como", "con", "para", "sobre", "y", "o",
        "no", "sí", "hola", "gracias", "inteligencia", "artificial",
    },
    "it": {
        "il", "lo", "la", "gli", "le", "un", "una", "è", "sono",
        "che", "chi", "dove", "quando", "perché", "come", "con",
        "per", "su", "e", "o", "non", "sì", "ciao", "grazie",
        "intelligenza", "artificiale",
    },
    "pt": {
        "o", "a", "os", "as", "um", "uma", "é", "são", "que", "quem",
        "onde", "quando", "porquê", "porque", "como", "com", "para",
        "sobre", "e", "ou", "não", "sim", "olá", "obrigado",
        "inteligência", "artificial",
    },
    "nl": {
        "de", "het", "een", "is", "zijn", "wat", "wie", "waar",
        "wanneer", "waarom", "hoe", "met", "voor", "van", "en",
        "of", "niet", "ja", "nee", "hallo", "dank", "kunstmatige",
        "intelligentie",
    },
    "tr": {
        "bir", "bu", "şu", "ne", "nedir", "kim", "nerede", "ne zaman",
        "neden", "nasıl", "ile", "için", "ve", "veya", "değil", "evet",
        "hayır", "merhaba", "teşekkür", "yapay", "zeka",
    },
    "ru": {
        "и", "или", "это", "как", "что", "кто", "где", "когда",
        "почему", "может", "да", "нет", "искусственный",
        "интеллект", "система",
    },
    "uk": {
        "і", "або", "це", "як", "що", "хто", "де", "коли", "чому",
        "може", "так", "ні", "штучний", "інтелект",
    },
    "el": {
        "και", "ή", "είναι", "τι", "ποιος", "πού", "πότε", "γιατί",
        "πώς", "με", "για", "δεν", "ναι", "όχι", "τεχνητή",
        "νοημοσύνη",
    },
    "he": {
        "מה", "מי", "איפה", "מתי", "למה", "איך", "עם", "של", "ו",
        "או", "לא", "כן", "בינה", "מלאכותית",
    },
    "fa": {
        "چی", "چه", "کی", "کجا", "چهار", "چرا", "چگونه", "با",
        "برای", "و", "یا", "نیست", "بله", "نه", "هوش", "مصنوعی",
        "سیستم",
    },
    "ur": {
        "کیا", "کون", "کہاں", "کب", "کیوں", "کیسے", "کے", "سے",
        "اور", "یا", "نہیں", "ہاں", "مصنوعی", "ذہانت",
    },
    "hi": {
        "क्या", "कौन", "कहाँ", "कब", "क्यों", "कैसे", "और", "या",
        "नहीं", "हाँ", "कृत्रिम", "बुद्धिमत्ता",
    },
    "zh": {
        "什么", "是", "谁", "哪里", "何时", "为什么", "怎么",
        "如何", "和", "或者", "不是", "人工", "智能", "系统",
    },
    "ja": {
        "何", "何ですか", "誰", "どこ", "いつ", "なぜ", "どう",
        "そして", "または", "人工", "知能", "システム",
    },
    "ko": {
        "무엇", "무엇인가요", "누구", "어디", "언제", "왜", "어떻게",
        "그리고", "또는", "아니다", "인공지능", "시스템",
    },
}


# ============================================================================
# Arabic dialect markers
# ============================================================================

_ALGERIAN_MARKERS = {
    "واش", "علاش", "وين", "كيفاش", "شكون", "بزاف", "صح", "راك",
    "راكم", "راني", "رانا", "راهو", "راه", "هاذي", "هاذا", "هذاك",
    "هذيك", "كاين", "ماكانش", "برك", "درك", "دوك", "صحا", "خاوتي",
    "خويا", "أختي", "نحب", "نقدر",
}

_EGYPTIAN_MARKERS = {
    "ازاي", "ليه", "فين", "مين", "عايز", "عاوز", "دلوقتي", "كده",
    "دي", "ده", "مش", "اوي",
}

_LEVANTINE_MARKERS = {
    "شو", "ليش", "وين", "كيف", "مين", "هلق", "هلأ", "مو", "مش",
    "كتير", "هيك",
}

_GULF_MARKERS = {
    "شلون", "وين", "وش", "وشو", "ليش", "الحين", "هالحين", "واجد",
    "مو", "مب",
}

_MAGHREBI_MARKERS = {
    "واش", "علاش", "فين", "وين", "كيفاش", "بزاف", "برشا", "شنوة",
    "شنو",
}


_TRANSLITERATED_ARABIC_MARKERS = {
    "ana", "enta", "enti", "houwa", "hiya", "wach", "wesh", "wech",
    "win", "wein", "kifach", "kifech", "kif", "alach", "3lach",
    "chkon", "chkoun", "bezaf", "bzaaf", "saha", "sah", "rani",
    "rana", "rak", "rah", "nheb", "n7eb", "n9der", "ma3lich",
    "machi", "makanach", "kayen",
}


# ============================================================================
# Basic helpers
# ============================================================================

def _safe_text(text: Any) -> str:
    if text is None:
        return ""

    try:
        return str(text)
    except Exception:
        return ""


def _in_ranges(char: str, ranges: Sequence[Tuple[str, str]]) -> bool:
    if not char:
        return False

    for start, end in ranges:
        if start <= char <= end:
            return True

    return False


def _script_for_char(char: str) -> Optional[str]:
    for script, ranges in _SCRIPT_RANGES.items():
        if _in_ranges(char, ranges):
            return script
    return None


# ============================================================================
# Character classification
# ============================================================================

def is_arabic_char(char: str) -> bool:
    return _in_ranges(char, _SCRIPT_RANGES["arabic"])


def is_latin_char(char: str) -> bool:
    return _in_ranges(char, _SCRIPT_RANGES["latin"])


def is_cyrillic_char(char: str) -> bool:
    return _in_ranges(char, _SCRIPT_RANGES["cyrillic"])


def is_digit_char(char: str) -> bool:
    return _in_ranges(char, _DIGIT_RANGES)


# ============================================================================
# Script statistics
# ============================================================================

def script_counts(text: Any) -> Dict[str, int]:
    value = _safe_text(text)

    counts: Dict[str, int] = {
        script: 0 for script in _SCRIPT_RANGES
    }

    counts.update({
        "digits": 0,
        "whitespace": 0,
        "punctuation": 0,
        "other": 0,
    })

    for char in value:
        script = _script_for_char(char)

        if script:
            counts[script] += 1
        elif is_digit_char(char):
            counts["digits"] += 1
        elif char.isspace():
            counts["whitespace"] += 1
        elif char.isalnum():
            counts["other"] += 1
        else:
            counts["punctuation"] += 1

    return counts


def dominant_script(text: Any) -> str:
    counts = script_counts(text)

    scripts = [
        script
        for script in _SCRIPT_RANGES
        if counts.get(script, 0) > 0
    ]

    if not scripts:
        return "unknown"

    if len(scripts) > 1:
        ranked = sorted(
            ((counts[script], script) for script in scripts),
            reverse=True,
        )

        top_count = ranked[0][0]
        second_count = ranked[1][0]

        if top_count == second_count:
            return "mixed"

        if second_count / max(top_count, 1) >= 0.35:
            return "mixed"

        return ranked[0][1]

    return scripts[0]


def script_profile(text: Any) -> Dict[str, Any]:
    counts = script_counts(text)

    script_letters = sum(
        counts.get(script, 0)
        for script in _SCRIPT_RANGES
    )

    total = sum(counts.values())

    def ratio(value: int) -> float:
        if script_letters <= 0:
            return 0.0
        return round(value / script_letters, 4)

    active_scripts = [
        script
        for script in _SCRIPT_RANGES
        if counts.get(script, 0) > 0
    ]

    return {
        "counts": counts,
        "total_characters": total,
        "letter_count": script_letters,
        "active_scripts": active_scripts,
        "dominant_script": dominant_script(text),
        "arabic_ratio": ratio(counts["arabic"]),
        "latin_ratio": ratio(counts["latin"]),
        "cyrillic_ratio": ratio(counts["cyrillic"]),
        "mixed": len(active_scripts) > 1,
        "script_mixed": len(active_scripts) > 1,
    }


# ============================================================================
# Tokenization
# ============================================================================

def tokenize_words(text: Any) -> List[str]:
    value = _safe_text(text)

    if not value:
        return []

    return re.findall(
        r"[^\W_]+(?:['’\-][^\W_]+)*",
        value,
        flags=re.UNICODE,
    )


def normalized_tokens(text: Any) -> List[str]:
    tokens = tokenize_words(text)

    return [
        unicodedata.normalize("NFKC", token).strip().lower()
        for token in tokens
        if token.strip()
    ]


# ============================================================================
# Language scoring
# ============================================================================

def _marker_score(
    tokens: Sequence[str],
    markers: set[str],
) -> int:
    return sum(
        1
        for token in tokens
        if token in markers
    )


def _arabic_lexical_score(tokens: Sequence[str]) -> int:
    common = {
        "ما", "ماذا", "متى", "أين", "اين", "كيف", "لماذا", "من",
        "هل", "هو", "هي", "هذا", "هذه", "ذلك", "تلك", "في", "إلى",
        "على", "عن", "مع", "ماهو", "ماهي", "نعم", "لا",
    }

    return _marker_score(tokens, common)


def language_scores(text: Any) -> Dict[str, int]:
    tokens = normalized_tokens(text)

    scores = {
        language: _marker_score(tokens, markers)
        for language, markers in _LANGUAGE_MARKERS.items()
    }

    scores["ar"] = _arabic_lexical_score(tokens)

    return scores


# ============================================================================
# Script-to-language candidates
# ============================================================================

_SCRIPT_LANGUAGE_CANDIDATES = {
    "arabic": ("ar", "fa", "ur"),
    "latin": (
        "en", "fr", "es", "it", "pt", "de", "nl", "tr"
    ),
    "cyrillic": ("ru", "uk"),
    "greek": ("el",),
    "hebrew": ("he",),
    "devanagari": ("hi",),
    "han": ("zh", "ja"),
    "hiragana": ("ja",),
    "katakana": ("ja",),
    "hangul": ("ko",),
    "thai": ("th",),
    "georgian": ("ka",),
    "armenian": ("hy",),
}


# ============================================================================
# Language detection
# ============================================================================

def _rank_languages(
    scores: Dict[str, int],
    candidates: Sequence[str],
) -> List[Tuple[int, str]]:
    ranked = [
        (scores.get(language, 0), language)
        for language in candidates
    ]

    return sorted(
        ranked,
        key=lambda item: (item[0], item[1]),
        reverse=True,
    )


def detect_language(text: Any) -> str:
    """
    Detect the most likely language conservatively.

    Important:
    Script and language are separate concepts.

    Returns:
        ISO-like language code,
        "mixed",
        or "unknown".
    """

    value = _safe_text(text).strip()

    if not value:
        return "unknown"

    profile = script_profile(value)
    scores = language_scores(value)
    tokens = normalized_tokens(value)

    if not tokens:
        return "unknown"

    active_scripts = profile["active_scripts"]

    # ------------------------------------------------------------------
    # Strong Han + Japanese kana
    # ------------------------------------------------------------------

    if "hiragana" in active_scripts or "katakana" in active_scripts:
        if "han" in active_scripts:
            return "ja"

        return "ja"

    # ------------------------------------------------------------------
    # Korean
    # ------------------------------------------------------------------

    if "hangul" in active_scripts:
        return "ko"

    # ------------------------------------------------------------------
    # Greek / Hebrew / Devanagari / Thai / Georgian / Armenian
    # ------------------------------------------------------------------

    unique_script_language = {
        "greek": "el",
        "hebrew": "he",
        "devanagari": "hi",
        "thai": "th",
        "georgian": "ka",
        "armenian": "hy",
    }

    for script, language in unique_script_language.items():
        if script in active_scripts:
            return language

    # ------------------------------------------------------------------
    # Strong Cyrillic
    # ------------------------------------------------------------------

    if "cyrillic" in active_scripts:
        ranked = _rank_languages(
            scores,
            _SCRIPT_LANGUAGE_CANDIDATES["cyrillic"],
        )

        if ranked and ranked[0][0] > 0:
            return ranked[0][1]

        # Conservative default for Cyrillic-only text.
        return "unknown"

    # ------------------------------------------------------------------
    # Arabic-derived scripts
    # ------------------------------------------------------------------

    if "arabic" in active_scripts:
        arabic_candidates = _rank_languages(
            scores,
            _SCRIPT_LANGUAGE_CANDIDATES["arabic"],
        )

        if arabic_candidates and arabic_candidates[0][0] > 0:
            best_score, best_language = arabic_candidates[0]

            # Arabic has its own lexical evidence. When Arabic,
            # Persian and Urdu tie, do not let alphabetical ordering
            # incorrectly select Persian.
            ar_score = scores.get("ar", 0)
            fa_score = scores.get("fa", 0)
            ur_score = scores.get("ur", 0)

            if (
                ar_score > 0
                and ar_score >= fa_score
                and ar_score >= ur_score
            ):
                return "ar"

            return best_language

        # Arabic script alone is not enough to distinguish
        # Arabic / Persian / Urdu.
        return "unknown"

    # ------------------------------------------------------------------
    # Latin script
    # ------------------------------------------------------------------

    if "latin" in active_scripts:
        candidates = _SCRIPT_LANGUAGE_CANDIDATES["latin"]
        ranked = _rank_languages(scores, candidates)

        if not ranked:
            return "unknown"

        best_score, best_language = ranked[0]

        if best_score <= 0:
            return "unknown"

        # Do not guess when evidence is tied.
        tied = [
            language
            for score, language in ranked
            if score == best_score
        ]

        if len(tied) > 1:
            return "unknown"

        return best_language

    # ------------------------------------------------------------------
    # Pure Han / CJK fallback
    # ------------------------------------------------------------------

    if "han" in active_scripts:
        score_zh = scores.get("zh", 0)
        score_ja = scores.get("ja", 0)

        if score_zh > score_ja:
            return "zh"

        if score_ja > score_zh:
            return "ja"

        return "zh"

    # ------------------------------------------------------------------
    # General lexical fallback
    # ------------------------------------------------------------------

    positive = [
        (score, language)
        for language, score in scores.items()
        if score > 0
    ]

    if not positive:
        return "unknown"

    positive.sort(reverse=True)

    if len(positive) > 1 and positive[0][0] == positive[1][0]:
        return "unknown"

    return positive[0][1]


# ============================================================================
# Mixed-language analysis
# ============================================================================

def _language_evidence(text: Any) -> Dict[str, int]:
    """
    Extract distinctive lexical evidence for mixed-language detection.

    This deliberately does NOT use generic/common words such as:
        the, is, a, and, de, la, que, o, e ...

    Technical/product tokens such as AI, RAG, Python and Quavron are
    also ignored as language evidence.
    """
    tokens = normalized_tokens(text)
    token_set = set(tokens)

    evidence: Dict[str, int] = {
        language: 0
        for language in _LANGUAGE_MARKERS
    }

    distinctive = {
        "en": {
            "what", "who", "where", "when", "why", "how",
            "which", "can", "could", "would", "should",
            "please", "about", "with", "from", "this", "that",
            "does", "using", "working", "function",
            "artificial", "intelligence",
        },

        "fr": {
            "bonjour", "merci", "système", "fonctionne",
            "fonctionner", "comment", "pourquoi", "quoi",
            "qui", "où", "quand", "avec", "dans",
            "artificielle",
        },

        "de": {
            "künstliche", "intelligenz", "warum", "wie",
            "welche", "welcher", "welches", "mit", "für",
            "nicht",
        },

        "es": {
            "qué", "quién", "dónde", "cuándo", "porqué",
            "cómo", "hola", "gracias", "inteligencia",
            "artificial",
        },

        "it": {
            "ciao", "grazie", "perché", "come", "dove",
            "quando", "intelligenza", "artificiale",
        },

        "pt": {
            "olá", "obrigado", "inteligência", "porquê",
        },

        "nl": {
            "hallo", "dank", "kunstmatige", "intelligentie",
            "wanneer", "waarom",
        },

        "tr": {
            "nedir", "kim", "nerede", "neden", "nasıl",
            "yapay", "zeka", "merhaba", "teşekkür",
        },

        "ru": {
            "искусственный", "интеллект", "почему", "когда",
            "кто", "где", "как", "система",
        },

        "uk": {
            "штучний", "інтелект", "чому", "коли",
            "хто", "де", "як",
        },

        "el": {
            "τεχνητή", "νοημοσύνη", "ποιος", "πού",
            "πότε", "γιατί", "πώς",
        },

        "he": {
            "בינה", "מלאכותית", "איפה", "מתי", "למה", "איך",
        },

        "fa": {
            "هوش", "مصنوعی", "چرا", "چگونه", "کجا",
        },

        "ur": {
            "مصنوعی", "ذہانت", "کہاں", "کیوں", "کیسے",
        },

        "hi": {
            "कृत्रिम", "बुद्धिमत्ता", "क्यों", "कैसे", "कहाँ",
        },

        "zh": {
            "什么", "人工", "智能", "为什么", "如何",
        },

        "ja": {
            "何", "人工", "知能", "なぜ", "どう",
        },

        "ko": {
            "인공지능", "무엇", "누구", "어디", "왜", "어떻게",
        },

        "ar": {
            "ما", "هو", "هي", "من", "أين", "متى",
            "لماذا", "كيف", "هذا", "هذه", "نظام",
            "ذكاء", "اصطناعي",
        },
    }

    # ------------------------------------------------------------------
    # Words that are too common/shared to identify a language.
    # ------------------------------------------------------------------
    ignored_common = {
        "a", "an", "the",
        "is", "are", "was", "were",
        "and", "or", "not",
        "de", "la", "le", "les",
        "un", "une", "des",
        "el", "los", "las",
        "que",
        "o", "os", "as",
        "e",
        "um", "uma",
        "com",
        "para",
        "por",
        "en",
        "da", "do",
    }

    # ------------------------------------------------------------------
    # Technical / product vocabulary must never create a language
    # by itself.
    # ------------------------------------------------------------------
    technical_tokens = {
        "ai", "rag", "qai", "quavron",
        "python", "javascript", "typescript",
        "react", "vite", "api", "sdk",
        "llm", "gpt", "json", "sql",
        "html", "css", "http", "https",
    }

    for language, markers in distinctive.items():
        hits = set()

        for token in token_set:
            if token in ignored_common:
                continue

            if token in technical_tokens:
                continue

            if token in markers:
                hits.add(token)

        evidence[language] = len(hits)

    # Arabic lexical evidence remains supported by the existing
    # Arabic-specific scorer.
    arabic_score = _arabic_lexical_score(tokens)

    if arabic_score > 0:
        evidence["ar"] = max(
            evidence.get("ar", 0),
            min(arabic_score, 3),
        )

    return evidence


def detect_mixed_languages(text: Any) -> Dict[str, Any]:
    """
    Detect genuine multilingual text.

    script_mixed and mixed_language are intentionally independent.

    script_mixed:
        More than one writing script is present.

    mixed_language:
        At least two languages have independent distinctive lexical
        evidence.
    """
    value = _safe_text(text)

    profile = script_profile(value)
    scores = language_scores(value)
    primary = detect_language(value)

    active_scripts = profile["active_scripts"]

    evidence_scores = _language_evidence(value)

    # ---------------------------------------------------------------
    # Build evidence languages.
    # ---------------------------------------------------------------
    evidence_languages: List[str] = [
        language
        for language, score in evidence_scores.items()
        if score > 0
    ]

    # ---------------------------------------------------------------
    # Preserve primary language.
    # ---------------------------------------------------------------
    if primary not in {"unknown", "mixed"}:
        if primary not in evidence_languages:
            evidence_languages.insert(0, primary)

    # ---------------------------------------------------------------
    # Remove weak secondary languages.
    #
    # A secondary language must have at least TWO distinctive lexical
    # markers. This is the main protection against:
    #
    #   English -> English + French
    #   Portuguese -> Portuguese + Spanish
    #
    # caused by shared vocabulary.
    # ---------------------------------------------------------------
    filtered_languages: List[str] = []

    for language in evidence_languages:
        score = evidence_scores.get(language, 0)

        if language == primary:
            filtered_languages.append(language)
            continue

        if score >= 2:
            filtered_languages.append(language)

    evidence_languages = list(dict.fromkeys(filtered_languages))

    # ---------------------------------------------------------------
    # Special case:
    #
    # A single highly distinctive marker can count as a secondary
    # language when the primary language is from another script.
    #
    # Example:
    #
    #   "ما هو artificial intelligence؟"
    #
    # Arabic is primary, while "artificial" + "intelligence" gives
    # strong English evidence anyway.
    # ---------------------------------------------------------------
    if primary not in {"unknown", "mixed"}:
        for language, score in evidence_scores.items():
            if language == primary:
                continue

            if score >= 2 and language not in evidence_languages:
                evidence_languages.append(language)

    # ---------------------------------------------------------------
    # Candidate languages remain script-aware for compatibility.
    # ---------------------------------------------------------------
    candidate_languages: List[str] = []

    for script in active_scripts:
        for language in _SCRIPT_LANGUAGE_CANDIDATES.get(script, ()):
            if language not in candidate_languages:
                candidate_languages.append(language)

    for language in evidence_languages:
        if language not in candidate_languages:
            candidate_languages.append(language)

    # ---------------------------------------------------------------
    # True multilingual state.
    # ---------------------------------------------------------------
    mixed_language = len(evidence_languages) >= 2

    return {
        "mixed": mixed_language,
        "mixed_language": mixed_language,
        "primary_language": primary,
        "candidate_languages": candidate_languages,
        "evidence_languages": evidence_languages,
        "active_scripts": active_scripts,
        "script_mixed": len(active_scripts) > 1,
        "language_scores": scores,
        "evidence_scores": evidence_scores,
    }


# ============================================================================
# Arabic dialect detection
# ============================================================================

def dialect_scores(text: Any) -> Dict[str, int]:
    tokens = set(normalized_tokens(text))

    return {
        "algerian": len(tokens & _ALGERIAN_MARKERS),
        "egyptian": len(tokens & _EGYPTIAN_MARKERS),
        "levantine": len(tokens & _LEVANTINE_MARKERS),
        "gulf": len(tokens & _GULF_MARKERS),
        "maghrebi": len(tokens & _MAGHREBI_MARKERS),
    }


def detect_dialect(text: Any) -> Optional[str]:
    language = detect_language(text)

    if language not in {"ar", "mixed", "unknown"}:
        return None

    scores = dialect_scores(text)

    best_dialect, best_score = max(
        scores.items(),
        key=lambda item: item[1],
    )

    if best_score <= 0:
        return None

    return best_dialect


# ============================================================================
# Transliteration
# ============================================================================

def detect_transliterated_arabic(text: Any) -> bool:
    tokens = set(normalized_tokens(text))

    if not tokens:
        return False

    matches = tokens & _TRANSLITERATED_ARABIC_MARKERS

    return len(matches) >= 1


# ============================================================================
# Text characteristics
# ============================================================================

def contains_arabic(text: Any) -> bool:
    return script_counts(text)["arabic"] > 0


def contains_latin(text: Any) -> bool:
    return script_counts(text)["latin"] > 0


def contains_cyrillic(text: Any) -> bool:
    return script_counts(text)["cyrillic"] > 0


def is_arabic_text(text: Any) -> bool:
    return detect_language(text) == "ar"


def is_latin_text(text: Any) -> bool:
    return script_counts(text)["latin"] > 0


def is_mixed_language(text: Any) -> bool:
    return detect_mixed_languages(text)["mixed"]


# ============================================================================
# Complete analysis
# ============================================================================

def analyze_language(text: Any) -> Dict[str, Any]:
    value = _safe_text(text)

    profile = script_profile(value)
    scores = language_scores(value)
    language = detect_language(value)
    dialect = detect_dialect(value)
    mixed = detect_mixed_languages(value)

    return {
        "text": value,
        "language": language,
        "dialect": dialect,
        "script": profile["dominant_script"],
        "script_profile": profile,
        "language_scores": scores,
        "candidate_languages": mixed["candidate_languages"],
        "evidence_languages": mixed["evidence_languages"],
        "transliterated_arabic": detect_transliterated_arabic(value),
        "contains_arabic": contains_arabic(value),
        "contains_latin": contains_latin(value),
        "contains_cyrillic": contains_cyrillic(value),
        "mixed_language": mixed["mixed_language"],
        "script_mixed": mixed["script_mixed"],
        "token_count": len(tokenize_words(value)),
    }


# ============================================================================
# Compatibility aliases
# ============================================================================

detect = detect_language
analyze = analyze_language
language_detect = detect_language
get_language = detect_language


# ============================================================================
# Public API
# ============================================================================

__all__ = [
    "is_arabic_char",
    "is_latin_char",
    "is_cyrillic_char",
    "is_digit_char",
    "script_counts",
    "script_profile",
    "dominant_script",
    "tokenize_words",
    "normalized_tokens",
    "language_scores",
    "detect_language",
    "detect_mixed_languages",
    "dialect_scores",
    "detect_dialect",
    "detect_transliterated_arabic",
    "contains_arabic",
    "contains_latin",
    "contains_cyrillic",
    "is_arabic_text",
    "is_latin_text",
    "is_mixed_language",
    "analyze_language",
    "detect",
    "analyze",
    "language_detect",
    "get_language",
]

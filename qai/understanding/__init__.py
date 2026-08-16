"""
QAI Understanding Layer
=======================

Complete, self-contained question-understanding package.

The layer provides:
- normalization
- language detection
- number extraction
- temporal analysis
- location extraction
- entity extraction
- relation extraction
- question-type classification
- intent detection
- conversational context
- complete question parsing

Integration with the existing QAI pipeline is intentionally
kept separate from this layer.
"""

from .normalization import (
    clean_text,
    normalize_text,
    normalize_query,
    normalize_for_matching,
    prepare_text,
    tokenize,
)

from .language import (
    detect_language,
    analyze_language,
    language_scores,
    language_detect,
    dominant_script,
)

from .numbers import (
    extract_numbers,
    extract_ordinals,
    extract_percentages,
    extract_ranges,
    first_number,
    number_summary,
)

from .temporal import (
    analyze_temporal,
    detect_temporal_expressions,
    detect_relative_time,
    detect_named_dates,
    detect_numeric_dates,
    detect_clock_times,
    detect_durations,
    temporal_profile,
)

from .locations import (
    extract_locations,
    extract_location_names,
    extract_target_location,
    parse_locations,
    normalize_location,
)

from .entities import (
    extract_entities,
    extract_entity_dicts,
    entity_names,
    entities_by_type,
)

from .relations import (
    extract_relations,
    extract_subjects,
    extract_objects,
    first_relation,
    relation_dict,
)

from .question_types import (
    detect_question_type,
    classify as classify_question_type,
    question_type,
    is_question,
)

from .intent import (
    detect_intent,
    classify as classify_intent,
    intent as detect_intent_simple,
    confidence as intent_confidence,
)

from .context import (
    UnderstandingContext,
    ContextTurn,
    ContextBuilder,
    build_context,
    merge_context,
    context_to_dict,
    context_from_dict,
)

from .question_parser import (
    ParsedQuestion,
    QuestionParser,
    parse_question,
    analyze_question,
    parse,
)


__all__ = [
    # Normalization
    "clean_text",
    "normalize_text",
    "normalize_query",
    "normalize_for_matching",
    "prepare_text",
    "tokenize",

    # Language
    "detect_language",
    "analyze_language",
    "language_scores",
    "language_detect",
    "dominant_script",

    # Numbers
    "extract_numbers",
    "extract_ordinals",
    "extract_percentages",
    "extract_ranges",
    "first_number",
    "number_summary",

    # Temporal
    "analyze_temporal",
    "detect_temporal_expressions",
    "detect_relative_time",
    "detect_named_dates",
    "detect_numeric_dates",
    "detect_clock_times",
    "detect_durations",
    "temporal_profile",

    # Locations
    "extract_locations",
    "extract_location_names",
    "extract_target_location",
    "parse_locations",
    "normalize_location",

    # Entities
    "extract_entities",
    "extract_entity_dicts",
    "entity_names",
    "entities_by_type",

    # Relations
    "extract_relations",
    "extract_subjects",
    "extract_objects",
    "first_relation",
    "relation_dict",

    # Question types
    "detect_question_type",
    "classify_question_type",
    "question_type",
    "is_question",

    # Intent
    "detect_intent",
    "classify_intent",
    "detect_intent_simple",
    "intent_confidence",

    # Context
    "UnderstandingContext",
    "ContextTurn",
    "ContextBuilder",
    "build_context",
    "merge_context",
    "context_to_dict",
    "context_from_dict",

    # Question parser
    "ParsedQuestion",
    "QuestionParser",
    "parse_question",
    "analyze_question",
    "parse",
]


__version__ = "1.0.0"
__layer__ = "understanding"
__status__ = "complete"

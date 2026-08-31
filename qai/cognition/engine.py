"""
QAI Cognitive Engine

Cognition is NOT a second Understanding implementation.

Its responsibility is to:

1. inspect the question
2. inspect Understanding
3. build an independent hypothesis
4. detect conflicts
5. assess semantic integrity
6. repair only what can be safely repaired
7. decide whether QAI should continue, reconcile, or analyze deeper

No external AI model is required.
No external API is required.
No factual answer is generated here.
"""

from dataclasses import asdict
import re
from typing import Any, Dict, List

from .models import (
    CognitiveRequest,
    CognitiveAnalysis,
    CognitiveDecision,
    CognitiveResult,
)


class CognitiveEngine:

    name = "qai-cognition"
    version = "0.6"

    # ---------------------------------------------------------
    # PUBLIC API
    # ---------------------------------------------------------

    def process(
        self,
        request: Any,
        context: Dict[str, Any] | None = None,
    ) -> CognitiveResult:

        request = self._coerce_request(request, context)

        question = self._clean(request.question)

        understanding = (
            request.understanding
            if isinstance(request.understanding, dict)
            else {}
        )

        analysis = self._analyze(
            question,
            understanding,
        )

        corrected = self._reconcile(
            question,
            understanding,
            analysis,
        )

        decision = self._decide(
            analysis,
            corrected,
        )

        corrections = self._corrections(
            understanding,
            corrected,
        )

        return CognitiveResult(
            analysis=analysis,
            decision=decision,
            corrections=corrections,
            corrected_understanding=corrected,
        )

    # ---------------------------------------------------------
    # REQUEST
    # ---------------------------------------------------------

    def _coerce_request(
        self,
        request: Any,
        context: Dict[str, Any] | None,
    ) -> CognitiveRequest:

        if isinstance(request, CognitiveRequest):
            return request

        if isinstance(request, str):
            return CognitiveRequest(
                question=request,
                context=context or {},
            )

        if isinstance(request, dict):
            return CognitiveRequest(
                question=str(
                    request.get("question", "")
                    or ""
                ),
                user_id=str(
                    request.get("user_id", "guest")
                    or "guest"
                ),
                context=request.get(
                    "context",
                    context or {},
                ) or {},
                understanding=request.get(
                    "understanding",
                    {},
                ) or {},
            )

        return CognitiveRequest(
            question=str(request or ""),
            context=context or {},
        )

    # ---------------------------------------------------------
    # CORE ANALYSIS
    # ---------------------------------------------------------

    def _analyze(
        self,
        question: str,
        understanding: Dict[str, Any],
    ) -> CognitiveAnalysis:

        normalized = self._normalize(question)

        signals = self._signals(
            question,
            understanding,
        )

        hypothesis = self._hypothesis(
            question,
            normalized,
            signals,
        )

        problems = self._problems(
            understanding,
            hypothesis,
        )

        conflicts = self._conflicts(
            understanding,
            hypothesis,
        )

        goals = self._goals(
            hypothesis,
            problems,
        )

        ambiguities = self._ambiguities(
            question,
            hypothesis,
            problems,
        )

        confidence = self._confidence(
            understanding,
            hypothesis,
            problems,
            conflicts,
        )

        return CognitiveAnalysis(
            question=question,
            normalized_question=normalized,
            goals=goals,
            ambiguities=ambiguities,
            signals=signals,
            problems=problems,
            hypothesis=hypothesis,
            conflicts=conflicts,
            confidence=confidence,
        )

    # ---------------------------------------------------------
    # SIGNALS
    # ---------------------------------------------------------

    def _signals(
        self,
        question: str,
        understanding: Dict[str, Any],
    ) -> Dict[str, Any]:

        text = question.strip()

        return {
            "empty": not bool(text),
            "question": self._looks_like_question(text),
            "compound": self._looks_compound(text),
            "comparison": self._looks_comparative(text),
            "length": len(text),
            "token_count": len(
                self._tokens(text)
            ),
            "has_latin": bool(
                re.search(r"[A-Za-z]", text)
            ),
            "has_arabic_script": bool(
                re.search(
                    r"[\u0600-\u06FF]",
                    text,
                )
            ),
            "has_cyrillic": bool(
                re.search(
                    r"[\u0400-\u04FF]",
                    text,
                )
            ),
            "understanding_present": bool(
                understanding
            ),
        }

    # ---------------------------------------------------------
    # HYPOTHESIS
    # ---------------------------------------------------------

    def _hypothesis(
        self,
        question: str,
        normalized: str,
        signals: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Build a STRUCTURAL hypothesis only.

        Cognition must NOT answer the question,
        inject factual knowledge, or map specific
        phrases to domain relations.

        Semantic content belongs to Understanding.
        """

        tokens = self._tokens(question)

        is_question = bool(
            signals.get("question")
        )

        compound = bool(
            signals.get("compound")
        )

        comparison = bool(
            signals.get("comparison")
        )

        role = self._infer_question_role(
            question
        )

        intent = None

        if is_question:
            if comparison:
                intent = "comparison"
            else:
                intent = "answer_question"

        segments = self._segments(
            question
        )

        semantic_roles = {}

        if compound:
            semantic_roles["multi_part"] = True

        if comparison:
            semantic_roles["comparison"] = True

        if role:
            semantic_roles["question_role"] = role

        return {
            "kind": (
                "question"
                if is_question
                else "statement"
            ),

            "question": is_question,

            "compound": compound,

            "comparison": comparison,

            "token_count": len(tokens),

            "segments": segments,

            # IMPORTANT:
            # Cognition does not invent semantic content.
            "subject": None,
            "target": None,
            "relation": None,

            "entities": [],
            "keywords": [],

            "intent": intent,

            "semantic_roles": semantic_roles,

            "evidence_required": is_question,

            "semantic_source": "understanding_required",

            "source": "cognitive_structure",
        }

    def _infer_question_role(
        self,
        question: str,
    ) -> str | None:
        """
        Detect only the linguistic QUESTION ROLE.

        This is a structural signal, not a semantic answer.

        Examples:
            من / who   -> person
            أين / where -> location
            متى / when -> time

        Cognition must not infer:
            capital_of
            created_by
            seat_of_government
            located_in
            etc.
        """

        text = self._normalize(
            question
        )

        if self._starts_with_question_form(
            text,
            {
                "من",
                "who",
            },
        ):
            return "person"

        if self._starts_with_question_form(
            text,
            {
                "أين",
                "اين",
                "where",
            },
        ):
            return "location"

        if self._starts_with_question_form(
            text,
            {
                "متى",
                "when",
            },
        ):
            return "time"

        if self._starts_with_question_form(
            text,
            {
                "لماذا",
                "why",
            },
        ):
            return "reason"

        if self._starts_with_question_form(
            text,
            {
                "كيف",
                "how",
            },
        ):
            return "method"

        if self._starts_with_question_form(
            text,
            {
                "أي",
                "اي",
                "which",
            },
        ):
            return "selection"

        if self._starts_with_question_form(
            text,
            {
                "ما",
                "ماذا",
                "ماهو",
                "ما هي",
                "what",
            },
        ):
            return "object"

        return None

    def _starts_with_question_form(
        self,
        text: str,
        forms: set[str],
    ) -> bool:

        tokens = self._tokens(text)

        if not tokens:
            return False

        return tokens[0] in forms

    # ---------------------------------------------------------
    # STRUCTURAL DETECTION
    # ---------------------------------------------------------

    def _looks_like_question(
        self,
        text: str,
    ) -> bool:

        if not text:
            return False

        if "?" in text or "؟" in text:
            return True

        normalized = self._normalize(
            text
        )

        return bool(
            re.match(
                r"^(من|ما|ماذا|متى|أين|اين|لماذا|كيف|هل|أي|اي|who|what|when|where|why|how|which|is|are|can|could|does|do)\b",
                normalized,
                re.I,
            )
        )

    def _looks_compound(
        self,
        text: str,
    ) -> bool:

        if "؟" not in text and "?" not in text:
            return bool(
                re.search(
                    r"[,،;؛]|\band\b|\bأو\b|\bوهل\b|\bو\b",
                    text,
                    re.I,
                )
            )

        parts = self._segments(text)

        return len(parts) > 1

    def _looks_comparative(
        self,
        text: str,
    ) -> bool:

        normalized = self._normalize(
            text
        )

        return bool(
            re.search(
                r"\b("
                r"vs|versus|or|أم|أو|مقابل|مقارنة|"
                r"أيهما|which"
                r")\b",
                normalized,
                re.I,
            )
        )

    # ---------------------------------------------------------
    # SEGMENTATION
    # ---------------------------------------------------------

    def _segments(
        self,
        text: str,
    ) -> List[str]:

        parts = re.split(
            r"[؟?]|[,،;؛]",
            text,
        )

        result = []

        for part in parts:
            part = part.strip()

            if part:
                result.append(part)

        return result or [text.strip()]

    # ---------------------------------------------------------
    # PROBLEM ANALYSIS
    # ---------------------------------------------------------

    def _problems(
        self,
        understanding: Dict[str, Any],
        hypothesis: Dict[str, Any],
    ) -> List[str]:

        problems = []

        if not understanding:
            problems.append(
                "missing_understanding"
            )
            return problems

        if not understanding.get(
            "entities"
        ):
            problems.append(
                "missing_entities"
            )

        if not understanding.get(
            "relations"
        ):
            problems.append(
                "missing_relations"
            )

        if (
            understanding.get(
                "intent",
                "general",
            )
            in ("", None, "general")
        ):
            problems.append(
                "weak_intent"
            )

        confidence = float(
            understanding.get(
                "confidence",
                0.0,
            )
            or 0.0
        )

        if confidence <= 0:
            problems.append(
                "missing_understanding_confidence"
            )

        if not understanding.get(
            "subject"
        ):
            problems.append(
                "missing_subject"
            )

        if not understanding.get(
            "target"
        ):
            problems.append(
                "missing_target"
            )

        return problems

    # ---------------------------------------------------------
    # CONFLICTS
    # ---------------------------------------------------------

    def _conflicts(
        self,
        understanding: Dict[str, Any],
        hypothesis: Dict[str, Any],
    ) -> List[Dict[str, Any]]:

        conflicts = []

        if not understanding:
            if hypothesis.get(
                "question"
            ):
                conflicts.append(
                    {
                        "field": "is_question",
                        "understanding": False,
                        "cognition": True,
                    }
                )

            return conflicts

        # Cognition's question-level intent is STRUCTURAL only.
        # It must not conflict with Understanding's semantic intent.
        #
        # Example:
        #   Understanding: information
        #   Cognition:     answer_question
        #
        # These are different semantic levels, not a conflict.
        pairs = [
            (
                "is_question",
                bool(
                    understanding.get(
                        "is_question",
                        False,
                    )
                ),
                bool(
                    hypothesis.get(
                        "question",
                        False,
                    )
                ),
            ),
        ]

        for field, left, right in pairs:

            if right is None:
                continue

            if left != right:

                conflicts.append(
                    {
                        "field": field,
                        "understanding": left,
                        "cognition": right,
                    }
                )

        return conflicts

    # ---------------------------------------------------------
    # RECONCILIATION
    # ---------------------------------------------------------

    def _reconcile(
        self,
        question: str,
        understanding: Dict[str, Any],
        analysis: CognitiveAnalysis,
    ) -> Dict[str, Any]:
        """
        Reconcile only structural information.

        Cognition may repair:
            - original
            - normalized
            - is_question
            - structural intent

        Cognition must NOT invent:
            - subject
            - target
            - relation
            - entities
            - keywords

        Those belong to Understanding.
        """

        base = dict(
            understanding
        )

        hypothesis = analysis.hypothesis

        # ---------------------------------------------------------
        # BASIC TEXT STRUCTURE
        # ---------------------------------------------------------

        if not base.get("original"):
            base["original"] = question

        if not base.get("normalized"):
            base["normalized"] = (
                analysis.normalized_question
            )

        # ---------------------------------------------------------
        # QUESTION DETECTION
        # ---------------------------------------------------------

        if "is_question" not in base:
            base["is_question"] = bool(
                hypothesis.get(
                    "question",
                    False,
                )
            )
        elif (
            base.get("is_question") is False
            and hypothesis.get("question")
        ):
            base["is_question"] = True

        # ---------------------------------------------------------
        # INTENT
        # ---------------------------------------------------------

        current_intent = base.get(
            "intent"
        )

        hypothesis_intent = hypothesis.get(
            "intent"
        )

        if (
            hypothesis_intent
            and (
                not current_intent
                or current_intent == "general"
            )
        ):
            base["intent"] = hypothesis_intent
            base["intent_source"] = "cognition"
            base["intent_confidence"] = 0.55

        # ---------------------------------------------------------
        # COGNITIVE METADATA
        # ---------------------------------------------------------

        meta = dict(
            base.get("meta", {})
            or {}
        )

        if hypothesis.get("compound"):
            meta["cognitive_compound"] = True

        if hypothesis.get("comparison"):
            meta["cognitive_comparison"] = True

        meta["cognition"] = {
            "reviewed": True,
            "version": self.version,
            "hypothesis": hypothesis,
            "problems": analysis.problems,
            "conflicts": analysis.conflicts,
            "role": hypothesis.get(
                "semantic_roles",
                {},
            ),
            "semantic_source": (
                "understanding"
                if understanding
                else "missing"
            ),
            "factual_invention": False,
        }

        base["meta"] = meta

        # ---------------------------------------------------------
        # IMPORTANT:
        # Do NOT create semantic fields here.
        #
        # If Understanding is empty, subject/target/relation/
        # entities remain absent.
        #
        # Cognition observes the absence; it does not replace it.
        # ---------------------------------------------------------

        return base

    # ---------------------------------------------------------
    # DECISION
    # ---------------------------------------------------------

    def _decide(
        self,
        analysis: CognitiveAnalysis,
        corrected: Dict[str, Any],
    ) -> CognitiveDecision:

        problems = set(
            analysis.problems
        )

        confidence = analysis.confidence

        # ---------------------------------------------------------
        # EMPTY INPUT
        # ---------------------------------------------------------

        if analysis.signals.get(
            "empty"
        ):
            return CognitiveDecision(
                action="reject",
                reason="The question is empty.",
                confidence=1.0,
            )

        # ---------------------------------------------------------
        # NO UNDERSTANDING
        #
        # Cognition cannot repair semantic understanding.
        # It can only report that Understanding is missing.
        # ---------------------------------------------------------

        if (
            "missing_understanding"
            in problems
        ):
            return CognitiveDecision(
                action="needs_understanding",
                reason=(
                    "Understanding is missing. "
                    "Cognition produced only a structural "
                    "hypothesis and did not invent semantic content."
                ),
                confidence=confidence,
            )

        # ---------------------------------------------------------
        # CONFLICT
        # ---------------------------------------------------------

        if analysis.conflicts:
            return CognitiveDecision(
                action="reconcile",
                reason=(
                    "Understanding and Cognition "
                    "disagree on structural information."
                ),
                confidence=confidence,
            )

        # ---------------------------------------------------------
        # INCOMPLETE UNDERSTANDING
        # ---------------------------------------------------------

        if (
            "weak_intent" in problems
            or "missing_entities" in problems
            or "missing_understanding_confidence" in problems
        ):
            return CognitiveDecision(
                action="analyze_deeper",
                reason=(
                    "Understanding exists but is incomplete. "
                    "Additional semantic analysis is required."
                ),
                confidence=confidence,
            )

        # ---------------------------------------------------------
        # CONSISTENT UNDERSTANDING
        # ---------------------------------------------------------

        if (
            not problems
            and not analysis.conflicts
        ):
            return CognitiveDecision(
                action="continue",
                reason=(
                    "Understanding and Cognition "
                    "are semantically consistent."
                ),
                confidence=confidence,
            )

        # ---------------------------------------------------------
        # SAFE DEFAULT
        # ---------------------------------------------------------

        return CognitiveDecision(
            action="continue",
            reason=(
                "No blocking cognitive defect detected."
            ),
            confidence=confidence,
        )

    # ---------------------------------------------------------
    # GOALS
    # ---------------------------------------------------------

    def _goals(
        self,
        hypothesis: Dict[str, Any],
        problems: List[str],
    ) -> List[str]:

        goals = []

        intent = hypothesis.get(
            "intent"
        )

        if intent:
            goals.append(intent)

        if problems:
            goals.append(
                "audit_understanding"
            )

        if hypothesis.get(
            "compound"
        ):
            goals.append(
                "inspect_multiple_parts"
            )

        return list(
            dict.fromkeys(goals)
        )

    # ---------------------------------------------------------
    # AMBIGUITIES
    # ---------------------------------------------------------

    def _ambiguities(
        self,
        question: str,
        hypothesis: Dict[str, Any],
        problems: List[str],
    ) -> List[str]:

        result = []

        if not question:
            return result

        if hypothesis.get(
            "compound"
        ):
            result.append(
                "compound_structure"
            )

        if hypothesis.get(
            "question"
        ) and not hypothesis.get(
            "intent"
        ):
            result.append(
                "question_intent_unresolved"
            )

        if (
            "missing_entities"
            in problems
        ):
            result.append(
                "entity_structure_unresolved"
            )

        if (
            "missing_relations"
            in problems
        ):
            result.append(
                "relation_structure_unresolved"
            )

        return result

    # ---------------------------------------------------------
    # CONFIDENCE
    # ---------------------------------------------------------

    def _confidence(
        self,
        understanding: Dict[str, Any],
        hypothesis: Dict[str, Any],
        problems: List[str],
        conflicts: List[Dict[str, Any]],
    ) -> float:

        score = 0.35

        if hypothesis.get(
            "question"
        ):
            score += 0.15

        if hypothesis.get(
            "intent"
        ):
            score += 0.10

        if hypothesis.get(
            "compound"
        ):
            score += 0.03

        if not problems:
            score += 0.25

        if conflicts:
            score -= 0.10

        understanding_confidence = float(
            understanding.get(
                "confidence",
                0.0,
            )
            or 0.0
        )

        if understanding_confidence > 0.7:
            score += 0.15

        elif understanding_confidence > 0.3:
            score += 0.05

        score = max(
            0.0,
            min(
                1.0,
                score,
            ),
        )

        return round(
            score,
            2,
        )

    # ---------------------------------------------------------
    # CORRECTIONS
    # ---------------------------------------------------------

    def _corrections(
        self,
        original: Dict[str, Any],
        corrected: Dict[str, Any],
    ) -> List[str]:

        corrections = []

        for field in (
            "original",
            "normalized",
            "is_question",
            "intent",
        ):

            before = original.get(
                field
            )

            after = corrected.get(
                field
            )

            if before != after:
                corrections.append(
                    f"{field}_reconciled"
                )

        return corrections

    # ---------------------------------------------------------
    # TEXT UTILITIES
    # ---------------------------------------------------------

    def _clean(
        self,
        value: Any,
    ) -> str:

        return str(
            value or ""
        ).strip()

    def _normalize(
        self,
        text: str,
    ) -> str:

        text = text.strip()

        text = re.sub(
            r"\s+",
            " ",
            text,
        )

        return text

    def _tokens(
        self,
        text: str,
    ) -> List[str]:

        return re.findall(
            r"[\w\u0600-\u06FF]+(?:['’-][\w\u0600-\u06FF]+)*",
            text,
            re.UNICODE,
        )


# Module-level singleton
engine = CognitiveEngine()


def process(
    request: Any,
    context: Dict[str, Any] | None = None,
) -> CognitiveResult:

    return engine.process(
        request,
        context,
    )


def review(
    question: str,
    understanding: Dict[str, Any] | None = None,
) -> CognitiveResult:

    return engine.process(
        {
            "question": question,
            "understanding": (
                understanding or {}
            ),
        }
    )

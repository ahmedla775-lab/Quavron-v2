from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class CognitiveRequest:
    question: str
    user_id: str = "guest"
    context: Dict[str, Any] = field(default_factory=dict)
    understanding: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CognitiveAnalysis:
    question: str
    normalized_question: str
    goals: List[str] = field(default_factory=list)
    ambiguities: List[str] = field(default_factory=list)
    signals: Dict[str, Any] = field(default_factory=dict)

    problems: List[str] = field(default_factory=list)

    hypothesis: Dict[str, Any] = field(default_factory=dict)
    conflicts: List[Dict[str, Any]] = field(default_factory=list)

    confidence: float = 0.0


@dataclass
class CognitiveDecision:
    action: str
    reason: str
    confidence: float = 0.0
    data: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CognitiveResult:
    analysis: CognitiveAnalysis
    decision: CognitiveDecision

    corrections: List[str] = field(default_factory=list)

    corrected_understanding: Dict[str, Any] = field(
        default_factory=dict
    )

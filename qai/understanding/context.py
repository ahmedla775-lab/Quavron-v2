from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, List, Optional


def _clean_text(value: Any) -> str:
    return str(value or "").strip()


def _clean_list(values: Optional[Iterable[Any]]) -> List[str]:
    if values is None:
        return []

    result: List[str] = []

    for value in values:
        text = _clean_text(value)
        if text:
            result.append(text)

    return result


@dataclass
class ContextTurn:
    """
    Represents one user/assistant interaction.

    This structure is deliberately independent from the current Brain,
    LocalDriver, RAG, or memory implementations.
    """

    user: str = ""
    assistant: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user": self.user,
            "assistant": self.assistant,
            "metadata": dict(self.metadata),
        }


@dataclass
class UnderstandingContext:
    """
    Structured context used by QAI's future understanding layer.

    The class does not perform reasoning or retrieval. It only stores,
    normalizes, and exposes contextual information in a stable format.
    """

    current_question: str = ""
    previous_question: str = ""
    previous_answer: str = ""

    conversation: List[ContextTurn] = field(default_factory=list)

    user_id: Optional[str] = None
    session_id: Optional[str] = None

    language: Optional[str] = None
    domain: Optional[str] = None
    intent: Optional[str] = None

    entities: List[Dict[str, Any]] = field(default_factory=list)
    relations: List[Dict[str, Any]] = field(default_factory=list)
    temporal: Dict[str, Any] = field(default_factory=dict)
    locations: List[Dict[str, Any]] = field(default_factory=list)

    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.current_question = _clean_text(self.current_question)
        self.previous_question = _clean_text(self.previous_question)
        self.previous_answer = _clean_text(self.previous_answer)

        if self.user_id is not None:
            self.user_id = _clean_text(self.user_id) or None

        if self.session_id is not None:
            self.session_id = _clean_text(self.session_id) or None

        if self.language is not None:
            self.language = _clean_text(self.language) or None

        if self.domain is not None:
            self.domain = _clean_text(self.domain) or None

        if self.intent is not None:
            self.intent = _clean_text(self.intent) or None

        self.metadata = dict(self.metadata or {})
        self.temporal = dict(self.temporal or {})

        self.entities = [
            dict(item)
            for item in self.entities
            if isinstance(item, dict)
        ]

        self.relations = [
            dict(item)
            for item in self.relations
            if isinstance(item, dict)
        ]

        self.locations = [
            dict(item)
            for item in self.locations
            if isinstance(item, dict)
        ]

        normalized_conversation: List[ContextTurn] = []

        for item in self.conversation:
            if isinstance(item, ContextTurn):
                normalized_conversation.append(item)

            elif isinstance(item, dict):
                normalized_conversation.append(
                    ContextTurn(
                        user=_clean_text(item.get("user")),
                        assistant=_clean_text(item.get("assistant")),
                        metadata=dict(item.get("metadata") or {}),
                    )
                )

        self.conversation = normalized_conversation

    @property
    def has_previous_turn(self) -> bool:
        return bool(
            self.previous_question
            or self.previous_answer
            or self.conversation
        )

    @property
    def turn_count(self) -> int:
        return len(self.conversation)

    @property
    def is_empty(self) -> bool:
        return not bool(
            self.current_question
            or self.previous_question
            or self.previous_answer
            or self.conversation
            or self.entities
            or self.relations
            or self.locations
            or self.temporal
        )

    def add_turn(
        self,
        user: str,
        assistant: str = "",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ContextTurn:
        """
        Add a conversation turn and update previous question/answer.
        """
        turn = ContextTurn(
            user=_clean_text(user),
            assistant=_clean_text(assistant),
            metadata=dict(metadata or {}),
        )

        self.conversation.append(turn)

        self.previous_question = turn.user
        self.previous_answer = turn.assistant

        return turn

    def set_question(self, question: str) -> None:
        """
        Set the current question while preserving previous context.
        """
        self.current_question = _clean_text(question)

    def set_language(self, language: Optional[str]) -> None:
        self.language = _clean_text(language) or None

    def set_domain(self, domain: Optional[str]) -> None:
        self.domain = _clean_text(domain) or None

    def set_intent(self, intent: Optional[str]) -> None:
        self.intent = _clean_text(intent) or None

    def add_entity(self, entity: Dict[str, Any]) -> None:
        if not isinstance(entity, dict):
            return

        self.entities.append(dict(entity))

    def add_relation(self, relation: Dict[str, Any]) -> None:
        if not isinstance(relation, dict):
            return

        self.relations.append(dict(relation))

    def add_location(self, location: Dict[str, Any]) -> None:
        if not isinstance(location, dict):
            return

        self.locations.append(dict(location))

    def update_temporal(self, values: Dict[str, Any]) -> None:
        if not isinstance(values, dict):
            return

        self.temporal.update(values)

    def set_metadata(self, key: str, value: Any) -> None:
        key = _clean_text(key)

        if not key:
            return

        self.metadata[key] = value

    def get_metadata(self, key: str, default: Any = None) -> Any:
        return self.metadata.get(key, default)

    def recent_turns(self, limit: int = 5) -> List[ContextTurn]:
        """
        Return the most recent conversation turns.

        Negative or invalid limits produce an empty list.
        """
        try:
            limit = int(limit)
        except (TypeError, ValueError):
            return []

        if limit <= 0:
            return []

        return list(self.conversation[-limit:])

    def recent_questions(self, limit: int = 5) -> List[str]:
        return [
            turn.user
            for turn in self.recent_turns(limit)
            if turn.user
        ]

    def recent_answers(self, limit: int = 5) -> List[str]:
        return [
            turn.assistant
            for turn in self.recent_turns(limit)
            if turn.assistant
        ]

    def previous_user_text(self) -> str:
        """
        Return the most recent user utterance before the current question.
        """
        if self.previous_question:
            return self.previous_question

        for turn in reversed(self.conversation):
            if turn.user:
                return turn.user

        return ""

    def previous_assistant_text(self) -> str:
        """
        Return the most recent assistant response.
        """
        if self.previous_answer:
            return self.previous_answer

        for turn in reversed(self.conversation):
            if turn.assistant:
                return turn.assistant

        return ""

    def contextual_text(self, max_turns: int = 5) -> str:
        """
        Build a compact textual representation of recent conversation.

        This is intended as an input artifact for later understanding
        components, not as a generated answer.
        """
        parts: List[str] = []

        for turn in self.recent_turns(max_turns):
            if turn.user:
                parts.append(f"USER: {turn.user}")

            if turn.assistant:
                parts.append(f"ASSISTANT: {turn.assistant}")

        if self.current_question:
            parts.append(f"CURRENT: {self.current_question}")

        return "\n".join(parts)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "current_question": self.current_question,
            "previous_question": self.previous_question,
            "previous_answer": self.previous_answer,
            "conversation": [
                turn.to_dict()
                for turn in self.conversation
            ],
            "user_id": self.user_id,
            "session_id": self.session_id,
            "language": self.language,
            "domain": self.domain,
            "intent": self.intent,
            "entities": [dict(item) for item in self.entities],
            "relations": [dict(item) for item in self.relations],
            "temporal": dict(self.temporal),
            "locations": [dict(item) for item in self.locations],
            "metadata": dict(self.metadata),
        }

    def copy(self) -> "UnderstandingContext":
        return UnderstandingContext.from_dict(self.to_dict())

    @classmethod
    def from_dict(
        cls,
        data: Optional[Dict[str, Any]],
    ) -> "UnderstandingContext":
        if not isinstance(data, dict):
            return cls()

        return cls(
            current_question=data.get("current_question", ""),
            previous_question=data.get("previous_question", ""),
            previous_answer=data.get("previous_answer", ""),
            conversation=data.get("conversation", []),
            user_id=data.get("user_id"),
            session_id=data.get("session_id"),
            language=data.get("language"),
            domain=data.get("domain"),
            intent=data.get("intent"),
            entities=data.get("entities", []),
            relations=data.get("relations", []),
            temporal=data.get("temporal", {}),
            locations=data.get("locations", []),
            metadata=data.get("metadata", {}),
        )


class ContextBuilder:
    """
    Stateless helper for constructing UnderstandingContext instances.

    Keeping construction separate from the data structure makes it easier
    to connect the understanding layer to Brain/LocalDriver later without
    changing the context model itself.
    """

    def build(
        self,
        question: str,
        *,
        conversation: Optional[Iterable[Any]] = None,
        user_id: Optional[str] = None,
        session_id: Optional[str] = None,
        language: Optional[str] = None,
        domain: Optional[str] = None,
        intent: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> UnderstandingContext:

        turns: List[ContextTurn] = []

        for item in conversation or []:
            if isinstance(item, ContextTurn):
                turns.append(item)

            elif isinstance(item, dict):
                turns.append(
                    ContextTurn(
                        user=_clean_text(item.get("user")),
                        assistant=_clean_text(item.get("assistant")),
                        metadata=dict(item.get("metadata") or {}),
                    )
                )

        previous_question = ""
        previous_answer = ""

        if turns:
            previous_question = turns[-1].user
            previous_answer = turns[-1].assistant

        return UnderstandingContext(
            current_question=_clean_text(question),
            previous_question=previous_question,
            previous_answer=previous_answer,
            conversation=turns,
            user_id=user_id,
            session_id=session_id,
            language=language,
            domain=domain,
            intent=intent,
            metadata=dict(metadata or {}),
        )


def build_context(
    question: str,
    *,
    conversation: Optional[Iterable[Any]] = None,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None,
    language: Optional[str] = None,
    domain: Optional[str] = None,
    intent: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> UnderstandingContext:
    """
    Public convenience function for creating an understanding context.
    """
    return ContextBuilder().build(
        question,
        conversation=conversation,
        user_id=user_id,
        session_id=session_id,
        language=language,
        domain=domain,
        intent=intent,
        metadata=metadata,
    )


def merge_context(
    base: Optional[UnderstandingContext],
    extra: Optional[UnderstandingContext],
) -> UnderstandingContext:
    """
    Merge two contexts without mutating either input.

    Values explicitly present in `extra` take precedence over `base`.
    Conversation turns are appended in order.
    """
    if base is None and extra is None:
        return UnderstandingContext()

    if base is None:
        return extra.copy()

    if extra is None:
        return base.copy()

    result = base.copy()

    if extra.current_question:
        result.current_question = extra.current_question

    if extra.previous_question:
        result.previous_question = extra.previous_question

    if extra.previous_answer:
        result.previous_answer = extra.previous_answer

    if extra.user_id:
        result.user_id = extra.user_id

    if extra.session_id:
        result.session_id = extra.session_id

    if extra.language:
        result.language = extra.language

    if extra.domain:
        result.domain = extra.domain

    if extra.intent:
        result.intent = extra.intent

    if extra.conversation:
        result.conversation.extend(
            extra.copy().conversation
        )

    if extra.entities:
        result.entities.extend(
            dict(item)
            for item in extra.entities
        )

    if extra.relations:
        result.relations.extend(
            dict(item)
            for item in extra.relations
        )

    if extra.locations:
        result.locations.extend(
            dict(item)
            for item in extra.locations
        )

    if extra.temporal:
        result.temporal.update(extra.temporal)

    if extra.metadata:
        result.metadata.update(extra.metadata)

    return result


def context_to_dict(
    context: Optional[UnderstandingContext],
) -> Dict[str, Any]:
    """Convert a context object into a plain dictionary."""
    if context is None:
        return {}

    if isinstance(context, UnderstandingContext):
        return context.to_dict()

    if isinstance(context, dict):
        return dict(context)

    return {}


def context_from_dict(
    data: Optional[Dict[str, Any]],
) -> UnderstandingContext:
    """Create a context object from a dictionary."""
    return UnderstandingContext.from_dict(data)


__all__ = [
    "ContextTurn",
    "UnderstandingContext",
    "ContextBuilder",
    "build_context",
    "merge_context",
    "context_to_dict",
    "context_from_dict",
]

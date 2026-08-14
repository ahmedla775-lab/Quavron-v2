class ContextBuilder:

    def build(self, question, documents):
        """
        Build clean RAG context for QAI.

        Important:
        - Retrieval metadata remains available to the LLM.
        - Internal transport instructions are not presented as answer text.
        - The user's question is not duplicated inside every response.
        - Knowledge text remains the primary factual evidence.
        """

        if not documents:
            return ""

        parts = [
            "=== QAI KNOWLEDGE CONTEXT ===",
        ]

        for item in documents[:5]:

            if not isinstance(item, dict):
                continue

            text = str(
                item.get("text", "") or ""
            ).strip()

            if not text:
                continue

            source = str(
                item.get("source", "") or ""
            ).strip()

            score = item.get("score", 0)
            relevance = item.get("relevance", 0)
            final_score = item.get("final_score", 0)
            approved = item.get("approved", False)
            confidence = item.get("confidence", 0)
            teacher = str(
                item.get("teacher", "") or ""
            ).strip()

            stored_question = item.get(
                "question",
                "",
            )

            if isinstance(stored_question, dict):
                stored_question = " | ".join(
                    str(value)
                    for value in stored_question.values()
                    if value
                )

            stored_question = str(
                stored_question or ""
            ).replace("]", " ").strip()

            # Metadata is kept in a clearly separated internal
            # knowledge record instead of being mixed with prose.
            parts.append(
                "=== KNOWLEDGE ITEM ==="
            )

            parts.append(
                f"source={source}"
            )

            parts.append(
                f"score={score}"
            )

            parts.append(
                f"relevance={relevance}"
            )

            parts.append(
                f"final_score={final_score}"
            )

            parts.append(
                f"approved={str(approved).lower()}"
            )

            parts.append(
                f"confidence={confidence}"
            )

            if teacher:
                parts.append(
                    f"teacher={teacher}"
                )

            if stored_question:
                parts.append(
                    f"stored_question={stored_question}"
                )

            parts.append(
                "knowledge="
            )

            parts.append(
                text
            )

        return "\n".join(parts)


context = ContextBuilder()

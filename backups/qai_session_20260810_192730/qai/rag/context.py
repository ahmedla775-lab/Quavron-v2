class ContextBuilder:

    def build(self, question, documents):

        if not documents:
            return ""

        parts = [
            "=== QAI Retrieved Knowledge ===",
            f"Question: {question}",
            "Use retrieved knowledge only when it is directly relevant."
        ]

        for item in documents[:5]:

            text = item.get("text", "")

            if not text:
                continue

            source = item.get("source", "")
            score = item.get("score", 0)
            relevance = item.get("relevance", 0)
            final_score = item.get("final_score", 0)
            approved = item.get("approved", False)
            confidence = item.get("confidence", 0)
            teacher = item.get("teacher", "")
            stored_question = item.get("question", "")

            if isinstance(stored_question, dict):
                stored_question = " | ".join(
                    str(value)
                    for value in stored_question.values()
                    if value
                )

            stored_question = str(stored_question or "").replace("]", " ")

            parts.append(
                f"[source={source}; score={score}; relevance={relevance}; "
                f"final_score={final_score}; approved={str(approved).lower()}; "
                f"confidence={confidence}; teacher={teacher}; "
                f"question={stored_question}]"
            )

            parts.append(text)

        return "\n".join(parts)


context = ContextBuilder()

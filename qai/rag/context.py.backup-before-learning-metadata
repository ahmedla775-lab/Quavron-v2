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

            parts.append(
                f"[source={source}; score={score}; relevance={relevance}]"
            )

            parts.append(text)

        return "\n".join(parts)


context = ContextBuilder()

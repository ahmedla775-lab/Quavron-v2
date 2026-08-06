from knowledge.search.search import search_engine


class ContextBuilder:

    def build(self, question, documents):

        parts = []

        if documents:
            parts.append("=== Retrieved Context ===")

            for item in documents[:5]:

                score = item.get("score", 0)
                text = item.get("text", "")

                if text and score >= 5:
                    parts.append(text)


        knowledge = search_engine.search(question)

        if knowledge:

            selected = []

            for item in knowledge:

                score = item.get("score", 0)

                value = item.get("value")

                text = ""

                if isinstance(value, dict):

                    content = value.get("content")

                    if isinstance(content, dict):
                        text = content.get("ar", "")

                    elif content:
                        text = str(content)

                if text and score >= 5:
                    selected.append(text)


            if selected:

                existing = set(parts)

                unique = [
                    t for t in selected[:3]
                    if t not in existing
                ]

                if unique:
                    parts.append("")
                    parts.append("=== Knowledge Base ===")

                    for text in unique:
                        parts.append(text)


        return "\n".join(parts)


context = ContextBuilder()

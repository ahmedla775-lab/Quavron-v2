from knowledge.search.search import search_engine
from vector_memory.search import search


class ContextBuilder:

    def build(self, question, documents):

        parts = []

        if documents:

            parts.append("=== Vector Memory ===")

            for item in documents[:5]:

                parts.append(item["text"])


        knowledge = search_engine.search(question)

        if knowledge:

            parts.append("")

            parts.append("=== Knowledge Base ===")

            for item in knowledge:

                value = item["value"]

                if isinstance(value, dict):

                    value = value.get(
                        "description",
                        str(value)
                    )

                parts.append(str(value))


        return "\n".join(parts)


context = ContextBuilder()

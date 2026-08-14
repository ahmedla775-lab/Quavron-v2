class KnowledgeClassifier:

    def classify(self, document):
        title = document.get("title", "")
        snippet = document.get("snippet", "")
        content = document.get("content", "")

        text_length = len(
            f"{title} {snippet} {content}".strip()
        )

        if document.get("duplicate"):
            status = "duplicate"

        elif text_length == 0:
            status = "empty"

        elif text_length < 80:
            status = "thin"

        else:
            status = "candidate"

        return {
            **document,
            "knowledge_status": status,
            "text_length": text_length,
        }

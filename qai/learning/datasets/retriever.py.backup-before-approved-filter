import json
from pathlib import Path


class LearningRetriever:

    def __init__(self):
        self.path = Path(__file__).parent / "qai_learning.jsonl"

    def normalize(self, text):
        text = str(text).lower()

        replacements = {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ى": "ي",
            "ة": "ه",
        }

        for a, b in replacements.items():
            text = text.replace(a, b)

        return text

    def keywords(self, text):
        stop_words = {
            "ما", "هو", "هي", "من", "عن", "كيف",
            "لماذا", "ماذا", "هل", "اشرح", "اخبرني",
            "the", "what", "is", "how", "why", "about"
        }

        words = self.normalize(text).split()

        return [
            word for word in words
            if word and word not in stop_words
        ]

    def search(self, question, limit=5):
        if not self.path.exists():
            return []

        query_words = self.keywords(question)

        if not query_words:
            return []

        results = []

        try:
            with self.path.open("r", encoding="utf-8") as file:

                for line in file:
                    line = line.strip()

                    if not line:
                        continue

                    try:
                        item = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    # QAI لا يتعلم إلا من المعرفة المقبولة
                    if not item.get("approved", False):
                        continue

                    answer = item.get("answer", "")
                    original_question = item.get("question", "")
                    context = item.get("context", "")

                    if not answer:
                        continue

                    searchable = self.normalize(
                        f"{original_question} {answer} {context}"
                    )

                    score = 0

                    for word in query_words:
                        if word in self.normalize(original_question):
                            score += 30
                        elif word in searchable:
                            score += 10

                    if score > 0:
                        results.append({
                            "question": original_question,
                            "answer": answer,
                            "teacher": item.get("teacher"),
                            "confidence": item.get("confidence", 0),
                            "score": score,
                            "source": "learning_dataset"
                        })

        except OSError:
            return []

        results.sort(
            key=lambda x: (
                x["score"],
                x["confidence"]
            ),
            reverse=True
        )

        return results[:limit]


learning_retriever = LearningRetriever()

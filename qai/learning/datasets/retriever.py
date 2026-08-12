import json
from pathlib import Path


class LearningRetriever:

    def __init__(self):
        self.path = Path(__file__).parent / "qai_learning.jsonl"

    def normalize(self, text):
        text = str(text or "").lower()

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
            "the", "what", "is", "how", "why", "about",
        }

        words = self.normalize(text).split()

        return [
            word
            for word in words
            if word and word not in stop_words
        ]

    def search(self, question, limit=5):
        if not self.path.exists():
            return []

        question = str(question or "").strip()

        if not question:
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

                    # QAI لا يستخدم إلا المعرفة المعتمدة.
                    if not item.get("approved", False):
                        continue

                    answer = str(
                        item.get("answer", "") or ""
                    )

                    original_question = str(
                        item.get("question", "") or ""
                    )

                    context = str(
                        item.get("context", "") or ""
                    )

                    if not answer or not original_question:
                        continue

                    # -------------------------------------------------
                    # Semantic/topic relevance
                    # -------------------------------------------------
                    #
                    # IMPORTANT:
                    # Use the centralized learning relevance logic.
                    #
                    # This prevents generic keyword overlap from
                    # mixing official/local/platform/course records.
                    #
                    try:
                        from relevance.learning import learning_relevance

                        relevance = learning_relevance(
                            question,
                            original_question,
                            answer,
                        )

                    except Exception:
                        relevance = 0

                    # Relevance is the gate.
                    if relevance <= 0:
                        continue

                    # -------------------------------------------------
                    # Raw lexical score
                    # -------------------------------------------------

                    normalized_question = self.normalize(
                        original_question
                    )

                    searchable = self.normalize(
                        f"{original_question} {answer} {context}"
                    )

                    score = 0

                    for word in query_words:
                        if word in normalized_question:
                            score += 30

                        elif word in searchable:
                            score += 10

                    # -------------------------------------------------
                    # Combine semantic relevance with lexical ranking.
                    # -------------------------------------------------

                    try:
                        confidence = float(
                            item.get("confidence", 0) or 0
                        )
                    except (TypeError, ValueError):
                        confidence = 0

                    final_score = (
                        relevance * 2
                        + score
                        + int(confidence * 20)
                    )

                    results.append({
                        "question": original_question,
                        "answer": answer,
                        "teacher": item.get("teacher"),
                        "confidence": item.get("confidence", 0),
                        "approved": item.get("approved", False),
                        "score": final_score,
                        "relevance": relevance,
                        "source": "qai_learning",
                    })

        except OSError:
            return []

        results.sort(
            key=lambda x: (
                x.get("relevance", 0),
                x.get("score", 0),
                x.get("confidence", 0),
            ),
            reverse=True,
        )

        return results[:limit]


learning_retriever = LearningRetriever()

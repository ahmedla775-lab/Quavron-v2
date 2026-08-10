import re


class KnowledgeAnswerer:

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

        text = re.sub(r"[؟?!.,:؛،\"'()\[\]{}]", " ", text)

        return " ".join(text.split())

    def keywords(self, text):
        stop_words = {
            "ما", "هو", "هي", "هل", "من", "عن",
            "كيف", "ماذا", "لماذا", "اشرح",
            "لي", "اخبرني", "اريد", "ان",
            "what", "is", "the", "how", "why",
            "about", "can", "you",
            "qu", "est", "ce", "que",
        }

        return [
            word
            for word in self.normalize(text).split()
            if word and word not in stop_words
        ]

    def score(self, question, document):
        q_words = self.keywords(question)

        if not q_words:
            return 0

        text = self.normalize(document.get("text", ""))

        if not text:
            return 0

        score = 0

        for word in q_words:
            if word in text:
                score += 1

        return score

    def answer(self, question, documents):
        if not documents:
            return None

        candidates = []

        for document in documents:
            text = document.get("text", "").strip()

            if not text:
                continue

            retrieval_score = document.get("score", 0)

            # The retriever already gives strong source priority.
            # Only use sufficiently trusted knowledge here.
            source = document.get("source", "")

            if source == "qai_learning":
                minimum_score = 300
            elif source == "knowledge":
                minimum_score = 200
            else:
                minimum_score = 100

            if retrieval_score < minimum_score:
                continue

            keyword_score = self.score(question, document)

            if keyword_score <= 0:
                continue

            candidates.append({
                "text": text,
                "source": source,
                "retrieval_score": retrieval_score,
                "keyword_score": keyword_score,
            })

        if not candidates:
            return None

        candidates.sort(
            key=lambda x: (
                x["keyword_score"],
                x["retrieval_score"]
            ),
            reverse=True
        )

        best = candidates[0]

        # Avoid answering from weak generic vector memory.
        if best["source"] == "vector" and best["keyword_score"] < 2:
            return None

        return {
            "provider": "knowledge",
            "status": "completed",
            "answer": best["text"],
            "source": best["source"],
            "confidence": min(
                1.0,
                0.60
                + (best["keyword_score"] * 0.10)
            ),
            "retrieval_score": best["retrieval_score"],
        }


knowledge_answerer = KnowledgeAnswerer()

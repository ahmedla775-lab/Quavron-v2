import json
from pathlib import Path


class KnowledgeSearch:

    def __init__(self):

        self.knowledge = {}

        self.path = Path(
            "knowledge/store/quavron_knowledge.json"
        )

        self.load()

    # --------------------------------------------------
    # Load
    # --------------------------------------------------

    def load(self):

        if not self.path.exists():
            return

        try:

            with open(
                self.path,
                "r",
                encoding="utf-8"
            ) as file:

                self.knowledge = json.load(file)

        except Exception as e:

            print(
                "[KnowledgeSearch] Load error:",
                type(e).__name__,
                str(e)
            )

    # --------------------------------------------------
    # Normalize
    # --------------------------------------------------

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

    # --------------------------------------------------
    # Keywords
    # --------------------------------------------------

    def extract_keywords(self, text):

        text = self.normalize(text)

        stop_words = {
            "ما",
            "هو",
            "هي",
            "هل",
            "من",
            "عن",
            "كيف",
            "لماذا",
            "ماذا",
            "اشرح",
            "اخبرني",
            "لي",
            "اريد",
            "اريد ان",
            "the",
            "what",
            "is",
            "about",
            "tell",
            "me",
            "how",
            "why",
            "can",
            "do",
        }

        words = text.split()

        return [
            word
            for word in words
            if word and word not in stop_words
        ]

    # --------------------------------------------------
    # Extract multilingual text
    # --------------------------------------------------

    def multilingual_text(self, value):

        if isinstance(value, str):
            return value

        if isinstance(value, dict):

            parts = []

            for language in ("ar", "en", "fr"):

                if value.get(language):
                    parts.append(
                        str(value[language])
                    )

            return " ".join(parts)

        return ""

    # --------------------------------------------------
    # Search
    # --------------------------------------------------

    def search(self, keyword):

        keywords = self.extract_keywords(keyword)

        if not keywords:
            return []

        results = []

        def score_text(text):

            normalized = self.normalize(text)

            score = 0

            for word in keywords:

                if word in normalized:
                    score += 10

            return score

        def add_result(
            question,
            answer,
            score,
            category=None
        ):

            if not answer:
                return

            answer_text = self.multilingual_text(
                answer
            ).strip()

            question_text = self.multilingual_text(
                question
            ).strip()

            if not answer_text:
                return

            # Question relevance gets stronger weight.
            question_score = score_text(
                question_text
            )

            answer_score = score_text(
                answer_text
            )

            total = (
                score
                + question_score * 5
                + answer_score
            )

            if total <= 0:
                return

            results.append({
                "key": "faq",
                "value": {
                    "content": answer
                },
                "question": question,
                "category": category,
                "score": total,
            })

        def scan(data, parent=None):

            # ------------------------------------------
            # Dictionary
            # ------------------------------------------

            if isinstance(data, dict):

                # FAQ / knowledge record
                if (
                    "question" in data
                    and "answer" in data
                ):

                    add_result(
                        data.get("question"),
                        data.get("answer"),
                        0,
                        data.get("category")
                    )

                    return

                # Content record
                if "content" in data:

                    content = data.get(
                        "content"
                    )

                    text = self.multilingual_text(
                        content
                    )

                    score = score_text(text)

                    if score:

                        results.append({
                            "key": parent,
                            "value": data,
                            "score": score + 50,
                        })

                    return

                for key, value in data.items():

                    if key in {
                        "ar",
                        "en",
                        "fr",
                        "content",
                        "keywords",
                        "title",
                    }:
                        continue

                    key_score = score_text(
                        str(key)
                    )

                    if key_score:

                        results.append({
                            "key": key,
                            "value": value,
                            "score": key_score * 2,
                        })

                    scan(
                        value,
                        key
                    )

            # ------------------------------------------
            # List
            # ------------------------------------------

            elif isinstance(data, list):

                for item in data:
                    scan(item, parent)

        scan(self.knowledge)

        # ------------------------------------------
        # Sort
        # ------------------------------------------

        results.sort(
            key=lambda x: x.get("score", 0),
            reverse=True
        )

        # ------------------------------------------
        # Remove duplicates
        # ------------------------------------------

        cleaned = []
        seen = set()

        for item in results:

            value = item.get("value")

            fingerprint = str(
                value
            )[:300]

            if fingerprint in seen:
                continue

            seen.add(fingerprint)
            cleaned.append(item)

        return cleaned[:8]


search_engine = KnowledgeSearch()

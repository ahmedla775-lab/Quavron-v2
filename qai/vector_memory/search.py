import re
from qai.vector_memory.store import store


class VectorSearch:

    def normalize(self, text):
        text = text.lower()

        text = re.sub(
            r"[^\w\s\u0600-\u06FF]",
            " ",
            text
        )

        words = text.split()

        stop_words = {
            "في",
            "من",
            "على",
            "الى",
            "إلى",
            "هو",
            "هي",
            "عن",
            "كيف",
            "ما",
            "هل",
            "و"
        }

        return [
            w for w in words
            if w not in stop_words
        ]


    def search(self, query):

        query_words = self.normalize(query)

        results = []

        for item in store.all():

            text_words = self.normalize(
                item["text"]
            )

            score = 0

            for word in query_words:

                if word in text_words:
                    score += 5

                for text_word in text_words:
                    if word in text_word or text_word in word:
                        score += 1


            if score:

                results.append({
                    "score": score,
                    **item
                })


        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results


search = VectorSearch()

from vector_memory.store import store


class VectorSearch:

    def search(self, query):

        query = query.lower()

        results = []

        for item in store.all():

            text = item["text"].lower()

            score = 0

            for word in query.split():

                if word in text:

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

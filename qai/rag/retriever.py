from vector_memory.search import search


class Retriever:

    def retrieve(self, query, limit=5):

        results = search.search(query)

        return results[:limit]


retriever = Retriever()

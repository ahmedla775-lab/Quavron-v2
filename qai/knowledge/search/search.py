from knowledge.index.indexer import indexer

class KnowledgeSearch:

    def search(self, keyword):

        result = []

        for file in indexer.files:

            if keyword.lower() in file.lower():

                result.append(file)

        return result

search_engine = KnowledgeSearch()

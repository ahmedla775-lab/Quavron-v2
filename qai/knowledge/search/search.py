import json
from pathlib import Path


class KnowledgeSearch:

    def __init__(self):

        self.knowledge = {}
        self.load()


    def load(self):

        path = Path("knowledge/store/quavron_knowledge.json")

        if path.exists():

            with open(path, "r", encoding="utf-8") as file:
                self.knowledge = json.load(file)


    def search(self, keyword):

        keyword = keyword.lower()

        results = []


        def scan(data):

            if isinstance(data, dict):

                for key, value in data.items():

                    score = 0

                    if keyword == key.lower():
                        score += 10

                    elif keyword in key.lower():
                        score += 5


                    if keyword in str(value).lower():
                        score += 3


                    if score:

                        results.append({
                            "key": key,
                            "value": value,
                            "score": score
                        })


                    scan(value)


            elif isinstance(data, list):

                for item in data:
                    scan(item)


        scan(self.knowledge)


        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )


        return results[:5]


search_engine = KnowledgeSearch()

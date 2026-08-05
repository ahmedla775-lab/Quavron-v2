import json
from pathlib import Path


class KnowledgeSearch:


    def __init__(self):

        self.knowledge = {}

        self.load()



    def load(self):

        path = Path(
            "knowledge/store/quavron_knowledge.json"
        )

        if path.exists():

            with open(path,"r",encoding="utf-8") as f:

                self.knowledge = json.load(f)



    def search(self, keyword):

        words = keyword.lower().split()

        results=[]


        def scan(data):

            if isinstance(data,dict):

                for key,value in data.items():

                    score = 0

                    key_text = str(key).lower()

                    value_text = str(value).lower()


                    for word in words:


                        if word == key_text:

                            score += 20


                        elif word in key_text:

                            score += 10


                        elif word in value_text:

                            score += 2



                    if score:

                        results.append({

                            "key":key,

                            "value":value,

                            "score":score

                        })


                    scan(value)



            elif isinstance(data,list):

                for item in data:

                    scan(item)



        scan(self.knowledge)


        results.sort(
            key=lambda x:x["score"],
            reverse=True
        )


        return results[:5]



search_engine = KnowledgeSearch()

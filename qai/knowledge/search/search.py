import json
import re
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


    def normalize(self, text):

        text = str(text).lower()

        replacements = {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ى": "ي",
            "ة": "ه"
        }

        for a,b in replacements.items():
            text = text.replace(a,b)

        return text


    def extract_keywords(self, text):

        text = self.normalize(text)

        stop_words = [
            "ما",
            "هو",
            "هي",
            "عن",
            "كيف",
            "لماذا",
            "اشرح",
            "اخبرني",
            "اخبرني عن",
            "اريد",
            "اريد ان",
            "the",
            "what",
            "is",
            "about",
            "tell",
            "me",
            "create",
            "build"
        ]

        words = text.split()

        return [
            w for w in words
            if w not in stop_words
        ]


    def search(self, keyword):

        keywords = self.extract_keywords(keyword)

        results = []


        def scan(data):

            if isinstance(data, dict):

                for key,value in data.items():

                    score = 0

                    key_text = self.normalize(key)
                    value_text = self.normalize(value)

                    for word in keywords:

                        if word in key_text:
                            score += 10

                        if word in value_text:
                            score += 5


                    if score:

                        results.append({
                            "key": key,
                            "value": value,
                            "score": score
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

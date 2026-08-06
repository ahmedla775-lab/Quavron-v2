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

        ignore_keys = [
            "ar",
            "en",
            "fr",
            "content",
            "title",
            "keywords"
        ]

        def scan(data, parent=None):

            if isinstance(data, dict):

                # لا نبحث داخل الحقول الوصفية
                if any(k in data for k in ["content", "keywords", "title"]):
                    score = 0

                    text_blob = self.normalize(str(data))

                    for word in keywords:
                        if word in text_blob:
                            score += 10

                    if score:
                        results.append({
                            "key": parent,
                            "value": data,
                            "score": score
                        })

                    return

                for key, value in data.items():

                    if key in ignore_keys:
                        continue

                    key_text = self.normalize(key)
                    value_text = self.normalize(str(value))

                    score = 0

                    for word in keywords:
                        if word in key_text:
                            score += 20

                        if word in value_text:
                            score += 5

                    if score:

                        # boost structured knowledge entries
                        if isinstance(value, dict) and "content" in value:
                            score += 50

                        # ignore generic terminology block
                        if key == "terminology":
                            score = 0

                        if score:
                            results.append({
                                "key": key,
                                "value": value,
                                "score": score
                            })

                    scan(value, key)


            elif isinstance(data, list):
                for item in data:
                    scan(item, parent)


        scan(self.knowledge)

        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        # remove duplicate nested results
        cleaned = []
        seen = set()

        for item in results:
            key = str(item["key"])
            value = str(item["value"])

            fingerprint = value[:100]

            if fingerprint not in seen:
                seen.add(fingerprint)
                cleaned.append(item)

        # keep only answer-bearing knowledge entries when available
        answer_results = []

        for item in cleaned:
            value = item["value"]

            if isinstance(value, dict) and "content" in value:
                answer_results.append(item)

        if answer_results:
            cleaned = answer_results

        return cleaned[:3]


search_engine = KnowledgeSearch()

import json
from pathlib import Path

class KnowledgeStore:

    def __init__(self):
        self.data = {}

    def load(self):

        file = Path(__file__).parent / "quavron_knowledge.json"

        with open(file, "r", encoding="utf-8") as f:
            self.data = json.load(f)

    def get(self):

        return self.data

knowledge = KnowledgeStore()
knowledge.load()

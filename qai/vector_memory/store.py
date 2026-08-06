import json
from pathlib import Path


class VectorStore:

    def __init__(self):

        self.path = Path(
            "vector_memory/store.json"
        )

        self.items = []

        self.load()


    def load(self):

        if self.path.exists():

            self.items = json.loads(

                self.path.read_text(
                    encoding="utf-8"
                )

            )

        else:

            self.items = []


    def save(self):

        self.path.write_text(

            json.dumps(
                self.items,
                ensure_ascii=False,
                indent=2
            ),

            encoding="utf-8"

        )


    def clear(self):

        self.items = []

        self.save()


    def add(self, text, metadata=None):

        self.items.append({

            "text": text,

            "metadata": metadata or {}

        })

        self.save()


    def all(self):

        return self.items


store = VectorStore()

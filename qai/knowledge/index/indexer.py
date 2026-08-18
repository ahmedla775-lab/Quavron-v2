import json

from pathlib import Path

from qai.vector_memory.store import store


class KnowledgeIndexer:

    def build(self):

        store.clear()

        path = Path(
            "knowledge/store/quavron_knowledge.json"
        )

        if not path.exists():

            return 0


        data = json.loads(
            path.read_text(
                encoding="utf-8"
            )
        )


        self.walk(data)

        return len(store.all())


    def walk(self, value):

        if isinstance(value, dict):

            for k, v in value.items():

                if isinstance(k, str):

                    store.add(

                        k,

                        {

                            "type":"key"

                        }

                    )

                self.walk(v)


        elif isinstance(value, list):

            for item in value:

                self.walk(item)


        elif isinstance(value, str):

            store.add(

                value,

                {

                    "type":"text"

                }

            )


indexer = KnowledgeIndexer()

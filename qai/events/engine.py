import json
from pathlib import Path
from datetime import datetime


class EventEngine:

    def __init__(self):

        self.path = Path("events/storage/events.json")

        if not self.path.exists():
            self.path.write_text(
                "[]",
                encoding="utf-8"
            )


    def _load(self):

        return json.loads(
            self.path.read_text(
                encoding="utf-8"
            )
        )


    def _save(self, data):

        self.path.write_text(
            json.dumps(
                data,
                ensure_ascii=False,
                indent=2
            ),
            encoding="utf-8"
        )


    def log(

        self,

        event,

        source,

        metadata=None

    ):

        data = self._load()

        item = {

            "time": datetime.utcnow().isoformat(),

            "event": event,

            "source": source,

            "metadata": metadata or {}

        }

        data.append(item)

        self._save(data)

        return item


    def history(self):

        return self._load()


engine = EventEngine()

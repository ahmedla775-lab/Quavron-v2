import json
from pathlib import Path
from datetime import datetime


class Memory:

    def __init__(self):

        self.path = Path(
            "memory/storage/memory.json"
        )

        self.path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        if not self.path.exists():

            self.path.write_text(
                "[]",
                encoding="utf-8"
            )

    def load(self):

        return json.loads(

            self.path.read_text(
                encoding="utf-8"
            )

        )

    def save(self, data):

        self.path.write_text(

            json.dumps(
                data,
                ensure_ascii=False,
                indent=2
            ),

            encoding="utf-8"
        )

    def remember(
        self,
        user_input,
        response,
        user="anonymous",
        session="default",
        metadata=None
    ):

        data = self.load()

        item = {

            "user": user,
            "session": session,
            "input": user_input,
            "response": response,
            "metadata": metadata or {},
            "time": datetime.utcnow().isoformat()

        }

        data.append(item)

        self.save(data)

        return item

    def history(
        self,
        user=None,
        session=None
    ):

        data = self.load()

        if user:

            data = [
                x for x in data
                if x.get("user", "anonymous") == user
            ]

        if session:

            data = [
                x for x in data
                if x.get("session", "default") == session
            ]

        return data


memory = Memory()

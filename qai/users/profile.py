import json
from pathlib import Path
from datetime import datetime


class UserProfile:


    def __init__(self):

        self.path = Path(
            "users/storage/users.json"
        )

        if not self.path.exists():

            self.path.write_text(
                "{}",
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


    def create(

        self,

        user_id

    ):

        users = self.load()


        if user_id not in users:

            users[user_id] = {

                "created": datetime.utcnow().isoformat(),

                "activity": [],

                "preferences": {},

                "metadata": {}

            }


            self.save(users)


        return users[user_id]


    def get(self, user_id):

        users = self.load()

        return users.get(user_id)


profile = UserProfile()

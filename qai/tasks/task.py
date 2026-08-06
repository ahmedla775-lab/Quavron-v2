from uuid import uuid4
from datetime import datetime


class Task:

    def create(self, title):

        return {

            "id": str(uuid4()),

            "title": title,

            "status": "pending",

            "created_at": datetime.utcnow().isoformat()

        }


task = Task()

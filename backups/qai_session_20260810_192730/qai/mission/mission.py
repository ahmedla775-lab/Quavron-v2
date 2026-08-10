from uuid import uuid4
from datetime import datetime


class Mission:

    def create(self, title):

        return {

            "id": str(uuid4()),

            "title": title,

            "status": "created",

            "created_at": datetime.utcnow().isoformat(),

            "workflows": []

        }


mission = Mission()

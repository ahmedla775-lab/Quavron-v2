from uuid import uuid4


class Workflow:

    def create(self, name):

        return {

            "id": str(uuid4()),

            "name": name,

            "status": "created",

            "steps": []

        }


workflow = Workflow()

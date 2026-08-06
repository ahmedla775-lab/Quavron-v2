from datetime import datetime


class Executor:

    def execute(self, mission):

        return {

            "mission": mission,

            "status": "completed",

            "started_at": datetime.utcnow().isoformat(),

            "finished_at": datetime.utcnow().isoformat()

        }


executor = Executor()

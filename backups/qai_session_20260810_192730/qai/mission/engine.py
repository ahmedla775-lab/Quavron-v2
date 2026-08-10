from mission.mission import mission


class MissionEngine:

    def launch(self, title):

        item = mission.create(title)

        item["status"] = "running"

        return {

            "engine": "Mission Engine",

            "mission": item

        }


engine = MissionEngine()

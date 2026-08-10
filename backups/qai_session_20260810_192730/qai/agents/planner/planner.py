class PlannerAgent:

    def run(self, task):

        task = str(task)

        return {

            "agent": "Planner Agent",

            "task": task,

            "status": "planned",

            "steps": [

                {

                    "id": 1,

                    "title": "Analyze"

                },

                {

                    "id": 2,

                    "title": "Research"

                },

                {

                    "id": 3,

                    "title": "Design"

                },

                {

                    "id": 4,

                    "title": "Implement"

                },

                {

                    "id": 5,

                    "title": "Test"

                },

                {

                    "id": 6,

                    "title": "Deploy"

                }

            ]

        }


planner = PlannerAgent()

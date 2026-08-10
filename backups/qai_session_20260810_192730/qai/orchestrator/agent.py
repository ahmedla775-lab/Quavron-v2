class Agent:

    def __init__(self, name):

        self.name = name


    def run(self, task):

        return {

            "agent": self.name,

            "task": task,

            "status": "completed"

        }

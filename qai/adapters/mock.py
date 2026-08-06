from adapters.base import Adapter


class MockAdapter(Adapter):

    def __init__(self):

        super().__init__("mock")


    def execute(self, task):

        return {

            "adapter": self.name,

            "task": task,

            "status": "completed"

        }

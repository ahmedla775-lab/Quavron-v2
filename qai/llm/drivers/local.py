from llm.drivers.base import BaseDriver


class LocalDriver(BaseDriver):

    def __init__(self):

        super().__init__("local")


    def available(self):

        return True


    def ask(self, prompt):

        return {

            "provider":"local",

            "status":"completed",

            "answer":"No external AI provider configured."

        }


driver = LocalDriver()

from llm.provider import Provider


class MockProvider(Provider):

    def __init__(self):

        super().__init__("mock")


    def generate(self, prompt):

        return {

            "provider": self.name,

            "answer": f"Mock response: {prompt}"

        }

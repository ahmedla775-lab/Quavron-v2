class ProviderRegistry:

    def __init__(self):
        self.providers = {}


    def register(self, provider):

        self.providers[provider.name] = provider


    def get(self, name):

        return self.providers.get(name)


    def all(self):

        return list(self.providers.keys())


registry = ProviderRegistry()


try:
    from llm.drivers.openai_driver import driver as openai_driver
    registry.register(openai_driver)

except Exception as e:
    print("OpenAI registration error:", e)


try:
    from llm.mock_provider import MockProvider

    mock = MockProvider()

    registry.register(mock)

except Exception as e:
    print("Mock registration error:", e)

class DriverRegistry:

    def __init__(self):

        self.drivers = {}


    def register(self, driver):

        self.drivers[driver.name] = driver


    def get(self, name):

        return self.drivers.get(name)


    def all(self):

        return list(self.drivers.keys())


registry = DriverRegistry()


try:

    from llm.drivers.local import driver as local_driver

    registry.register(local_driver)

except Exception:

    pass


try:

    from llm.drivers.openai_driver import driver as openai_driver

    registry.register(openai_driver)

except Exception:

    pass

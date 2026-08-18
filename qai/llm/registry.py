class DriverRegistry:
    def __init__(self):
        self.drivers = {}

    def register(self, driver):
        if driver is None:
            return

        name = getattr(driver, "name", None)

        if not name:
            return

        self.drivers[name] = driver

        print(
            f"[LLM Registry] Registered driver: {name}"
        )

    def get(self, name):
        return self.drivers.get(name)

    def all(self):
        return list(self.drivers.keys())


registry = DriverRegistry()


# ==========================================
# LOCAL DRIVER ONLY
# ==========================================

try:
    from qai.llm.drivers.local import driver as local_driver
    registry.register(local_driver)

except Exception as e:
    print(
        "[LLM Registry] Local driver error:",
        type(e).__name__,
        str(e)
    )

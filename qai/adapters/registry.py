class AdapterRegistry:

    def __init__(self):

        self.adapters = {}


    def register(self, adapter):

        self.adapters[adapter.name] = adapter


    def get(self, name):

        return self.adapters.get(name)


registry = AdapterRegistry()


# autoregister
try:

    from adapters.git import adapter as git_adapter

    registry.register(git_adapter)

except Exception:

    pass


try:

    from adapters.filesystem import adapter as filesystem_adapter

    registry.register(filesystem_adapter)

except Exception:

    pass

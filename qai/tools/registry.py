class ToolRegistry:

    def __init__(self):

        self.tools = {}


    def register(self, tool):

        self.tools[tool["name"]] = tool


    def all(self):

        return list(self.tools.values())


registry = ToolRegistry()

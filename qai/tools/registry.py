class ToolRegistry:

    def __init__(self):
        self.tools = {}


    def register(self, name, function):

        self.tools[name] = function


    def execute(self, name, *args):

        if name not in self.tools:
            return "Tool not found"

        return self.tools[name](*args)


    def list(self):

        return list(self.tools.keys())


tools = ToolRegistry()

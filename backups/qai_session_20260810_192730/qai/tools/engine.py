from tools.tool import tool
from tools.registry import registry


class ToolEngine:

    def load(self, name):

        item = tool.create(name)

        registry.register(item)

        return {

            "engine": "Tool Engine",

            "tool": item

        }


engine = ToolEngine()

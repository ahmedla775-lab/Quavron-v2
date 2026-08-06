class LLMRouter:

    def select(self, task):

        task = task.lower()

        if "image" in task or "vision" in task:
            return "openai"

        if "analysis" in task or "architecture" in task:
            return "openai"

        if "code" in task or "python" in task or "react" in task:
            return "openai"

        return "openai"


router = LLMRouter()

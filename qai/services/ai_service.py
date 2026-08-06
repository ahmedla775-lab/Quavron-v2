from brain.core.brain import brain


class AIService:

    def ask(self, message):

        return brain.think(message)


service = AIService()

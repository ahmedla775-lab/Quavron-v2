from qai.brain.core.brain import brain


class AIService:
    """
    Public service boundary for QAI.

    API layers communicate with QAI through this service
    instead of importing internal QAI components directly.
    """

    def think(self, message: str, user_id: str):
        return brain.think(
            question=message,
            user_id=user_id,
        )

    def chat(self, message: str, user_id: str):
        return brain.chat(
            message=message,
            user_id=user_id,
        )


service = AIService()

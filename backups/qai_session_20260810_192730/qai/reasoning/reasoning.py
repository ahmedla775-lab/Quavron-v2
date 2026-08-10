class ReasoningEngine:

    def __init__(self):
        self.version = "0.1"

    def analyze(self, message):

        intent = "general"

        text = message.lower()

        if "what" in text or "ما" in text or "explain" in text:
            intent = "question"

        elif "build" in text or "create" in text:
            intent = "creation"

        elif "code" in text or "develop" in text:
            intent = "development"

        return {
            "input": message,
            "intent": intent
        }


reasoning = ReasoningEngine()

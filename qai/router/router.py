class QAIRouter:


    def route(self, message):

        text = message.lower()


        if "code" in text or "build" in text:
            return "coding"


        if "security" in text:
            return "security"


        if "content" in text:
            return "content"


        return "knowledge"



router = QAIRouter()

class Router:


    def route(self, message):

        text = message.lower()


        if any(word in text for word in [
            "code",
            "create",
            "build",
            "react",
            "python",
            "javascript",
            "component"
        ]):

            return "coding"



        if any(word in text for word in [
            "security",
            "attack",
            "scan",
            "vulnerability"
        ]):

            return "security"



        if any(word in text for word in [
            "write",
            "article",
            "content",
            "post"
        ]):

            return "content"



        return "knowledge"



router = Router()

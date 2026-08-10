class LocalExpert:

    def ask(self, prompt):

        return {

            "expert": "Local",

            "status": "ready",

            "answer": None

        }


local = LocalExpert()

class Knowledge:

    def __init__(self):
        self.data = {
            "quavron": "Quavron is a next generation digital platform."
        }

    def search(self, query):

        query = query.lower()

        for key, value in self.data.items():
            if key in query:
                return value

        return "No knowledge found."


knowledge = Knowledge()

class QuavronBrain:

    def __init__(self):
        self.version = "0.1"

    def think(self, message):

        return {
            "status": "thinking",
            "message": message
        }

brain = QuavronBrain()

from router.router import router
from memory.memory import memory


class QuavronBrain:

    def think(self, message):

        memory.remember(message)

        result = router.route(message)

        return {
            "status": "completed",
            "response": result
        }


brain = QuavronBrain()

from reasoning.reasoning import reasoning
from knowledge.search.search import search_engine
from memory.memory import memory
from router.router import router
from agents.manager import agents


class QuavronBrain:


    def __init__(self):
        self.version="0.4"



    def think(self,message):

        analysis = reasoning.analyze(message)

        agent = router.route(message)


        knowledge = search_engine.search(message)


        if knowledge:
            answer = knowledge
        else:
            answer = "No knowledge found."


        agent_result = agents.run(
            agent,
            message
        )


        memory.remember(
            message,
            answer
        )


        return {

            "status":"completed",

            "agent":agent,

            "analysis":analysis,

            "answer":answer,

            "agent_result":agent_result

        }



brain = QuavronBrain()

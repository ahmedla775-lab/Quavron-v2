from reasoning.reasoning import reasoning
from memory.memory import memory
from router.router import router
from agents.manager import agents
from knowledge.search.search import search_engine


class QuavronBrain:


    def __init__(self):

        self.version = "0.6"



    def think(self, message):


        analysis = reasoning.analyze(message)


        knowledge = search_engine.search(message)



        if knowledge and knowledge[0].get("score",0) >= 5:

            agent = "knowledge"

            best = knowledge[0]

            value = best.get("value")


            if isinstance(value, dict):

                answer = value.get(
                    "description",
                    str(value)
                )

            else:

                answer = str(value)



        else:

            agent = router.route(message)


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

            "version":self.version,

            "agent":agent,

            "analysis":analysis,

            "answer":answer,

            "agent_result":agent_result

        }



brain = QuavronBrain()

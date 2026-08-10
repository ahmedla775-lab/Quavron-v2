from reasoning.reasoning import reasoning
from memory.memory import memory
from router.router import router
from agents.manager import agents
from knowledge.search.search import search_engine
from language.dictionary import dictionary
from learning.learner import learner


class QuavronBrain:


    def __init__(self):

        self.version = "0.6"



    def think(self, message):

        original_message = message

        message = dictionary.normalize(message)


        analysis = reasoning.analyze(message)


        learned = learner.get(original_message.lower())

        if not learned:
            learned = learner.get(message.lower())

        if learned:

            return {

                "status":"completed",

                "version":self.version,

                "original":original_message,

                "agent":"learning",

                "analysis":analysis,

                "answer":learned

            }


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

            "original": original_message,

            "agent":agent,

            "analysis":analysis,

            "answer":answer,

            "agent_result":agent_result

        }



brain = QuavronBrain()

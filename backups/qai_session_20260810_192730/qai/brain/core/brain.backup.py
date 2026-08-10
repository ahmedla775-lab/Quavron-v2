from pipeline.engine import pipeline

from llm.router import router

from llm.gateway import gateway

from orchestrator.engine import engine as orchestrator

from adapters.engine import engine as adapters

from rag.engine import engine as rag

from memory.memory import memory

from users.context.builder import context_builder


class QuavronBrain:


    def __init__(self):

        self.version = "1.0"


    def think(self, message, user_id=None):

        state = pipeline.process(message)


        provider = router.select(

            state["normalized"]

        )


        rag_data = rag.prepare(

            state["normalized"]

        )


        user_context = {}


        if user_id:

            user_context = context_builder.build(

                user_id,

                state["normalized"]

            )

        llm = gateway.ask(

            provider,

            state["normalized"],

            rag_data["context"]

        )


        agents = orchestrator.execute(

            state["normalized"]

        )

        if llm.get("status") == "completed":

            memory.remember(

                state["normalized"],

                llm["answer"],

                metadata={

                    "provider":provider,

                    "pipeline":state.get("intent")

                }

            )


        return {

            "status":"completed",

            "version":self.version,

            "pipeline":state,

            "rag":rag_data,

            "user_context":user_context,

            "provider":provider,

            "llm":llm,

            "agents":agents

        }


brain = QuavronBrain()

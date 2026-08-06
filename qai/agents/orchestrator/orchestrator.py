from agents.registry.registry import registry


class AgentOrchestrator:


    def route(self, event):

        agent_name = self.detect(event)


        agent = registry.get(agent_name)


        if agent is None:

            return {

                "status":"error",

                "message":"No agent available",

                "agent":agent_name

            }


        return agent.analyze(event)



    def detect(self, event):

        source = event.get(

            "source",

            ""

        )


        event_type = event.get(

            "event",

            ""

        )


        if source == "security" or "login" in event_type:

            return "security"


        return "security"



orchestrator = AgentOrchestrator()

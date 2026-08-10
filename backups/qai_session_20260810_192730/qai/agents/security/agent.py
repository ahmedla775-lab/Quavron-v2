from decision.engine import decision
from agents.registry.registry import registry


class SecurityAgent:


    def __init__(self):

        self.name = "security"


    def analyze(self, event):

        result = decision.analyze(event)


        return {

            "agent": self.name,

            "event": event,

            "result": result

        }


security_agent = SecurityAgent()

registry.register(security_agent)

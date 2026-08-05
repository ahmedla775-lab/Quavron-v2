class AgentManager:

    def __init__(self):
        self.agents = {
            "knowledge": "Knowledge Agent",
            "coding": "Coding Agent",
            "security": "Security Agent",
            "content": "Content Agent"
        }


    def list_agents(self):

        return self.agents


    def run(self, agent, task):

        if agent not in self.agents:
            return {
                "error": "Agent not found"
            }

        return {
            "agent": self.agents[agent],
            "task": task,
            "status": "completed"
        }


agents = AgentManager()

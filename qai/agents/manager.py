from knowledge.search.search import search_engine


class AgentManager:

    def __init__(self):

        self.agents = {

            "knowledge": self.knowledge_agent,

            "coding": self.coding_agent,

            "security": self.security_agent,

            "content": self.content_agent

        }


    def list_agents(self):

        return list(self.agents.keys())


    def run(self, agent, task):

        if agent not in self.agents:

            return {
                "error": "Agent not found"
            }


        return self.agents[agent](task)



    def knowledge_agent(self, task):

        results = search_engine.search(task)

        return {

            "agent": "Knowledge Agent",

            "task": task,

            "results": results[:3],

            "status": "completed"

        }



    def coding_agent(self, task):

        return {

            "agent": "Coding Agent",

            "task": task,

            "action": "Code analysis",

            "status": "completed"

        }



    def security_agent(self, task):

        return {

            "agent": "Security Agent",

            "task": task,

            "action": "Security analysis",

            "status": "completed"

        }



    def content_agent(self, task):

        return {

            "agent": "Content Agent",

            "task": task,

            "action": "Content generation",

            "status": "completed"

        }



agents = AgentManager()

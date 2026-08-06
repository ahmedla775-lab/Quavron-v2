from orchestrator.registry import registry


class Orchestrator:

    def execute(self, task):

        results = []

        for agent in registry.all():

            results.append(agent.run(task))

        return {

            "engine": "Agent Orchestrator",

            "task": task,

            "results": results

        }


engine = Orchestrator()

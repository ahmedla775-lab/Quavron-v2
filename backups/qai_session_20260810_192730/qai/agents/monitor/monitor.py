from agents.registry.registry import registry


class AgentMonitor:


    def status(self):

        agents = registry.all()

        result = []


        for name in agents:

            result.append({

                "agent": name,

                "status": "available"

            })


        return {

            "total": len(result),

            "agents": result

        }


monitor = AgentMonitor()

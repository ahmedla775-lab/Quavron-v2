from orchestrator.agent import Agent
from orchestrator.registry import registry


registry.register(Agent("Planner"))

registry.register(Agent("Knowledge"))

registry.register(Agent("Security"))

registry.register(Agent("Observer"))

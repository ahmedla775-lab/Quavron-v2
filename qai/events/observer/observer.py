from events.engine import engine
from agents.orchestrator.orchestrator import orchestrator


class EventObserver:


    def __init__(self):

        self.last_position = 0


    def watch(self):

        events = engine.history()

        new_events = events[self.last_position:]

        self.last_position = len(events)

        results = []


        for event in new_events:

            result = orchestrator.route(event)

            results.append(result)


        return results



observer = EventObserver()

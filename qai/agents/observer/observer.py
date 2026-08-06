from events.bus import bus


class ObserverAgent:

    def run(self):

        events = bus.latest(100)

        return {

            "agent": "Observer Agent",

            "events": len(events),

            "latest": events[-10:]

        }


observer = ObserverAgent()

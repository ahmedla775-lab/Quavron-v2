from datetime import datetime


class EventBus:

    def __init__(self):

        self.events = []


    def emit(self, event, data=None):

        item = {

            "time": datetime.utcnow().isoformat(),

            "event": event,

            "data": data or {}

        }

        self.events.append(item)

        return item


    def latest(self, limit=100):

        return self.events[-limit:]


bus = EventBus()

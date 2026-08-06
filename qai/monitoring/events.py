from datetime import datetime


class EventStore:

    def __init__(self):

        self.events = []


    def add(self, event_type, data=None):

        self.events.append({

            "time": datetime.utcnow().isoformat(),

            "type": event_type,

            "data": data or {}

        })


    def latest(self, limit=20):

        return self.events[-limit:]


events = EventStore()

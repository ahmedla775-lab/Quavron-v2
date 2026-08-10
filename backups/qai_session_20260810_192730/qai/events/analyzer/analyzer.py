from collections import Counter

from events.engine import engine


class EventAnalyzer:

    def summary(self):

        events = engine.history()

        return {

            "total_events": len(events),

            "sources": Counter(

                item["source"]

                for item in events

            ),

            "event_types": Counter(

                item["event"]

                for item in events

            )

        }


    def latest(self, limit=10):

        return engine.history()[-limit:]


analyzer = EventAnalyzer()

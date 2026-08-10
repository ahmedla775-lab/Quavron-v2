from events.bus import bus


class SecurityAgent:

    def run(self):

        events = bus.latest(500)

        alerts = []

        for event in events:

            name = event.get("event", "")

            if "FailedLogin" in name:

                alerts.append({

                    "level": "warning",

                    "event": event

                })

            elif "PermissionDenied" in name:

                alerts.append({

                    "level": "high",

                    "event": event

                })

            elif "SpamDetected" in name:

                alerts.append({

                    "level": "critical",

                    "event": event

                })

        return {

            "agent": "Security Agent",

            "alerts": alerts,

            "count": len(alerts)

        }


security = SecurityAgent()

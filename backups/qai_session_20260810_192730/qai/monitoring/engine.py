from monitoring.events import events


class MonitoringEngine:

    def login(self, user):

        events.add(

            "user_login",

            {

                "user": user

            }

        )


    def logout(self, user):

        events.add(

            "user_logout",

            {

                "user": user

            }

        )


    def action(self, user, action):

        events.add(

            "user_action",

            {

                "user": user,

                "action": action

            }

        )


    def latest(self):

        return events.latest()


engine = MonitoringEngine()

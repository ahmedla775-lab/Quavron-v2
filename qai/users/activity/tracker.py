from datetime import datetime

from users.profile import profile


class ActivityTracker:


    def track(

        self,

        user_id,

        action,

        metadata=None

    ):

        user = profile.get(user_id)


        if user is None:

            user = profile.create(user_id)


        activity = {

            "action": action,

            "metadata": metadata or {},

            "time": datetime.utcnow().isoformat()

        }


        user["activity"].append(activity)


        users = profile.load()

        users[user_id] = user

        profile.save(users)


        return activity



    def history(self, user_id):

        user = profile.get(user_id)


        if not user:

            return []


        return user.get(

            "activity",

            []

        )


tracker = ActivityTracker()

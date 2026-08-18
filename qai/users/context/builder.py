from qai.users.profile import profile

from qai.users.activity.tracker import tracker

from qai.memory.memory import memory


class UserContextBuilder:


    def build(

        self,

        user_id,

        query

    ):

        user = profile.get(

            user_id

        )


        activity = tracker.history(

            user_id

        )


        memories = memory.history(

            user=user_id

        )


        return {

            "user": user or {},

            "activity": activity[-10:],

            "memory": memories[-10:],

            "query": query

        }



context_builder = UserContextBuilder()

class Skill:

    def create(self, name, description=""):

        return {

            "name": name,

            "description": description,

            "enabled": True

        }


skill = Skill()

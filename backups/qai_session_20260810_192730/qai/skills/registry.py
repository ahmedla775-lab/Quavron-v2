class SkillRegistry:

    def __init__(self):

        self.skills = {}


    def register(self, skill):

        self.skills[skill["name"]] = skill


    def get(self, name):

        return self.skills.get(name)


    def all(self):

        return list(self.skills.values())


registry = SkillRegistry()

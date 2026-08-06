from skills.skill import skill
from skills.registry import registry


class SkillEngine:

    def load(self, name, description=""):

        item = skill.create(name, description)

        registry.register(item)

        return {

            "engine": "Skill Engine",

            "skill": item

        }


engine = SkillEngine()

from teachers.openai_teacher import teacher as openai_teacher


class TeacherManager:
    def __init__(self):
        self.teachers = {
            "openai": openai_teacher
        }

    def available_teachers(self):
        return [
            name
            for name, teacher in self.teachers.items()
            if teacher.available()
        ]

    def teach(self, question, context=""):
        results = []

        for name, teacher in self.teachers.items():
            if teacher.available():
                result = teacher.teach(question, context)
                results.append(result)

        return results


teacher_manager = TeacherManager()

from qai.teachers.local_teacher import teacher as local_teacher


class TeacherManager:
    def __init__(self):
        self.teachers = {
            "local": local_teacher,
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
                result = teacher.teach(
                    question,
                    context,
                )
                results.append(result)

        return results


teacher_manager = TeacherManager()

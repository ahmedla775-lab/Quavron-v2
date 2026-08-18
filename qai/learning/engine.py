from qai.teachers.manager import teacher_manager
from qai.learning.evaluator import evaluator
from qai.learning.datasets.manager import LearningDataset


class LearningEngine:

    def __init__(self):
        self.dataset = LearningDataset()

    def learn(self, question, context="", supervisor=False):
        # ==========================================
        # Supervisor Learning
        # ==========================================
        if supervisor:
            record = self.dataset.add(
                question=question,
                answer=context,
                teacher="supervisor",
                context=context,
                confidence=1.0,
                approved=True
            )

            return {
                "status": "completed",
                "mode": "supervisor",
                "teachers": [],
                "evaluation": {
                    "accepted": True,
                    "confidence": 1.0,
                    "answer": context,
                    "teacher": "supervisor",
                    "reason": "Approved by supervisor"
                },
                "dataset_record": record
            }

        # ==========================================
        # External AI Teachers
        # ==========================================
        teachers = teacher_manager.teach(
            question,
            context
        )

        evaluation = evaluator.evaluate(
            question,
            teachers
        )

        record = self.dataset.add(
            question=question,
            answer=evaluation.get("answer", ""),
            teacher=evaluation.get("teacher"),
            context=context,
            confidence=evaluation.get("confidence", 0.0),
            approved=evaluation.get("accepted", False)
        )

        return {
            "status": "completed",
            "mode": "teacher",
            "teachers": teachers,
            "evaluation": evaluation,
            "dataset_record": record
        }


learning_engine = LearningEngine()

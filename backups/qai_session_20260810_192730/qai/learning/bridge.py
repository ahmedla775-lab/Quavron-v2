from learning.evaluator import LearningEvaluator
from learning.gate import learning_gate
from learning.engine import LearningEngine


class LearningBridge:

    def __init__(self):
        self.evaluator = LearningEvaluator()
        self.engine = LearningEngine()

    # =========================================================
    # TEACHER EVALUATION
    # =========================================================

    def evaluate_teacher_answer(
        self,
        question,
        answer,
        teacher=None,
    ):
        question = str(question or "").strip()
        answer = str(answer or "").strip()

        if not question or not answer:
            return {
                "accepted": False,
                "confidence": 0.0,
                "answer": "",
                "teacher": teacher,
                "reason": "Missing question or answer",
            }

        teacher_answer = {
            "status": "completed",
            "answer": answer,
            "teacher": teacher,
        }

        try:
            return self.evaluator.evaluate(
                question,
                [teacher_answer],
            )

        except Exception as e:
            return {
                "accepted": False,
                "confidence": 0.0,
                "answer": "",
                "teacher": teacher,
                "reason": f"Evaluation error: {type(e).__name__}",
            }

    # =========================================================
    # LEARNING GATE
    # =========================================================

    def can_learn(
        self,
        evaluation,
        supervisor=False,
    ):
        return learning_gate.should_learn(
            evaluation,
            supervisor=supervisor,
        )

    # =========================================================
    # SUPERVISOR APPROVED LEARNING
    # =========================================================

    def save_approved(
        self,
        question,
        answer,
        context="",
        supervisor=False,
    ):
        question = str(question or "").strip()
        answer = str(answer or "").strip()
        context = str(context or "").strip()

        if not question or not answer:
            return {
                "status": "skipped",
                "reason": "Missing question or answer",
            }

        # -----------------------------------------------------
        # Approval is explicit.
        # Do not allow a non-supervisor caller to create
        # supervisor-approved knowledge.
        # -----------------------------------------------------

        if supervisor is not True:
            return {
                "status": "rejected",
                "reason": "Supervisor approval is required",
            }

        evaluation = {
            "accepted": True,
            "confidence": 1.0,
            "answer": answer,
            "teacher": "supervisor",
            "reason": "Approved by supervisor",
        }

        # -----------------------------------------------------
        # Learning gate
        # -----------------------------------------------------

        if not self.can_learn(
            evaluation,
            supervisor=True,
        ):
            return {
                "status": "rejected",
                "evaluation": evaluation,
                "reason": "Learning gate rejected the knowledge",
            }

        # -----------------------------------------------------
        # Save approved knowledge
        # -----------------------------------------------------

        try:
            result = self.engine.learn(
                question,
                answer,
                supervisor=True,
            )

            return {
                "status": "completed",
                "evaluation": evaluation,
                "learning": result,
            }

        except Exception as e:
            return {
                "status": "error",
                "evaluation": evaluation,
                "error": type(e).__name__,
                "message": str(e),
            }


learning_bridge = LearningBridge()

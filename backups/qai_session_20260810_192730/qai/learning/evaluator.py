class LearningEvaluator:

    def evaluate(self, question, answers):
        valid = [
            answer
            for answer in answers
            if answer.get("status") == "completed"
            and answer.get("answer")
        ]

        if not valid:
            return {
                "accepted": False,
                "confidence": 0.0,
                "answer": "",
                "teacher": None,
                "reason": "No valid teacher answer"
            }

        # المرحلة الأولى:
        # لا ندخل معرفة المعلمين إلى QAI تلقائيًا.
        # تحتاج المعرفة إلى موافقة المشرف.
        best = valid[0]

        return {
            "accepted": False,
            "confidence": 0.50,
            "answer": best["answer"],
            "teacher": best.get("teacher"),
            "reason": "Requires supervisor approval"
        }


evaluator = LearningEvaluator()

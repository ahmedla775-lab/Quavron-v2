class LearningGate:

    def should_learn(self, evaluation, supervisor=False):
        if not evaluation:
            return False

        if supervisor:
            return True

        return bool(
            evaluation.get("accepted") is True
            and float(
                evaluation.get("confidence", 0) or 0
            ) >= 0.80
        )


learning_gate = LearningGate()

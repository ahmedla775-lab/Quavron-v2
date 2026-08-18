from qai.llm.drivers.local import driver as local_driver


class LocalTeacher:
    name = "local"

    def available(self):
        return local_driver.available()

    def teach(self, question, context=""):
        result = local_driver.ask(
            question,
            context,
        )

        return {
            "teacher": self.name,
            "provider": result.get("provider", "local"),
            "status": result.get("status", "completed"),
            "answer": result.get("answer", ""),
            "source": result.get("source", "local"),
            "confidence": result.get("confidence", 0.0),
            "relevance": result.get("relevance", 0),
        }


teacher = LocalTeacher()

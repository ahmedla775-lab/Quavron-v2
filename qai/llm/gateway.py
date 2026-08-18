from qai.llm.drivers.registry import registry


class LLMGateway:

    def ask(
        self,
        provider,
        prompt,
        context=""
    ):
        driver = registry.get(provider)

        if driver is None:
            return {
                "provider": provider,
                "status": "error",
                "source": "driver_not_found",
                "confidence": 0,
                "relevance": 0,
                "answer": "",
                "message": "Driver not found",
            }

        if not driver.available():
            return {
                "provider": provider,
                "status": "error",
                "source": "driver_unavailable",
                "confidence": 0,
                "relevance": 0,
                "answer": "",
                "message": "Driver unavailable",
            }

        try:
            result = driver.ask(
                prompt,
                context
            )
        except Exception as e:
            return {
                "provider": provider,
                "status": "error",
                "source": "driver_error",
                "confidence": 0,
                "relevance": 0,
                "answer": "",
                "message": str(e),
            }

        if not isinstance(result, dict):
            return {
                "provider": provider,
                "status": "error",
                "source": "invalid_driver_result",
                "confidence": 0,
                "relevance": 0,
                "answer": "",
                "message": "Driver returned invalid result",
            }

        result.setdefault("provider", provider)

        return result

gateway = LLMGateway()

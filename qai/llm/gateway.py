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

                "status":"error",

                "message":"Driver not found"

            }


        if not driver.available():

            return {

                "status":"error",

                "message":"Driver unavailable"

            }


        return driver.ask(

            prompt,

            context

        )


gateway = LLMGateway()

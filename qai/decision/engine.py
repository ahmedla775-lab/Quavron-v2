from qai.rag.engine import engine as rag

from qai.llm.gateway import gateway

from qai.llm.router import router


class DecisionEngine:


    def analyze(self, event):

        context = rag.prepare(

            str(event)

        )


        provider = router.select(

            "analysis"

        )


        prompt = f"""

Analyze this platform event.

Event:
{event}


Context:
{context["context"]}


Return:
- Risk level
- Explanation
- Recommendation

"""


        result = gateway.ask(

            provider,

            prompt,

            context["context"]

        )


        return {

            "event": event,

            "analysis": result

        }


decision = DecisionEngine()

import os
from openai import OpenAI
from teachers.base import BaseTeacher


SYSTEM_PROMPT = """
You are a teacher for QAI, the Quavron AI system.

Your role is to teach QAI, not to replace QAI.

Provide:
- accurate knowledge
- clear explanations
- useful corrections
- structured answers
- important facts that QAI can learn

Do not claim that QAI already knows something unless it is provided in the context.
"""


class OpenAITeacher(BaseTeacher):
    name = "openai"

    def __init__(self):
        self.client = None

        api_key = os.environ.get("OPENAI_API_KEY")

        if api_key:
            self.client = OpenAI(api_key=api_key)

    def available(self):
        return self.client is not None

    def teach(self, question, context=""):
        if not self.available():
            return {
                "teacher": self.name,
                "status": "unavailable",
                "answer": "",
                "reason": "OPENAI_API_KEY is not configured"
            }

        user_message = f"""
Context:
{context}

Question:
{question}
"""

        try:
            response = self.client.responses.create(
                model="gpt-5.4-mini",
                instructions=SYSTEM_PROMPT,
                input=user_message
            )

            return {
                "teacher": self.name,
                "status": "completed",
                "answer": response.output_text
            }

        except Exception as e:
            return {
                "teacher": self.name,
                "status": "error",
                "answer": "",
                "reason": str(e)
            }


teacher = OpenAITeacher()

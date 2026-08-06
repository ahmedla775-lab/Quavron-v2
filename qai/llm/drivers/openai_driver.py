import os

from openai import OpenAI

from llm.drivers.base import BaseDriver


SYSTEM_PROMPT = """
You are Quavron AI.

You are the official AI assistant of the Quavron platform.

Always follow these rules:

1. Use Context as the source of truth, but rewrite it into a clear and helpful answer.

2. Never invent facts about Quavron.

3. If Context is insufficient, say that the information is unavailable,
then answer from your general knowledge if appropriate.

4. Be concise.

5. Answer in the same language as the user.
"""


class OpenAIDriver(BaseDriver):

    def __init__(self):

        super().__init__("openai")

        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY", "")
        )


    def available(self):

        return "OPENAI_API_KEY" in os.environ


    def ask(self, prompt, context=""):

        user_message = f"""
Context:

{context}

Question:

{prompt}
"""

        response = self.client.responses.create(

            model="gpt-5.4-mini",

            instructions=SYSTEM_PROMPT,

            input=user_message

        )

        return {

            "provider":"openai",

            "status":"completed",

            "answer":response.output_text

        }


driver = OpenAIDriver()

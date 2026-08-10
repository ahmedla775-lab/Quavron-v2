import os

from llm.drivers.base import BaseDriver


SYSTEM_PROMPT = """
You are Quavron AI.

You are the official intelligent assistant of the Quavron platform.

Core rules:

1. Answer in the same language as the user.
2. Use the provided Context whenever it is relevant.
3. The Context may contain multiple documents.
4. You may combine and reason over multiple relevant documents.
5. Never invent facts about Quavron.
6. If the Context contains insufficient information about Quavron,
   clearly say that the available Quavron knowledge is insufficient.
7. For comparison questions, compare only information supported by
   the provided Context.
8. For programming questions, provide practical and technically
   useful answers.
9. Be concise unless the user asks for detailed explanation.
10. Do not mention internal systems such as RAG, vector search,
    drivers, providers, or routing unless the user explicitly asks.
11. Do not pretend that information from the Context is your own
    personal experience.
"""


class OpenAIDriver(BaseDriver):

    def __init__(self):
        super().__init__("openai")

        self.client = None

        api_key = os.environ.get("OPENAI_API_KEY", "").strip()

        if api_key:
            try:
                from openai import OpenAI

                self.client = OpenAI(api_key=api_key)

                print("[OpenAI Driver] Initialized successfully")

            except Exception as e:
                print(
                    "[OpenAI Driver] Initialization error:",
                    type(e).__name__,
                    str(e),
                )

    def available(self):
        return self.client is not None

    def ask(self, prompt, context=""):

        if not self.available():
            return {
                "provider": "openai",
                "status": "unavailable",
                "source": "openai",
                "confidence": 0.0,
                "relevance": 0,
                "answer": None,
                "message": "OpenAI provider is not configured.",
            }

        user_message = f"""
Context:
{context}

Question:
{prompt}
"""

        try:

            response = self.client.responses.create(
                model="gpt-5.4-mini",
                instructions=SYSTEM_PROMPT,
                input=user_message,
            )

            return {
                "provider": "openai",
                "status": "completed",
                "source": "openai",
                "confidence": 0.9,
                "relevance": 100 if context else 0,
                "answer": response.output_text,
                "message": None,
            }

        except Exception as e:

            return {
                "provider": "openai",
                "status": "error",
                "source": "openai",
                "confidence": 0.0,
                "relevance": 0,
                "answer": None,
                "message": str(e),
            }


driver = OpenAIDriver()

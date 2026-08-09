from __future__ import annotations

from typing import Any, Dict


class ResponseEngine:
    """
    Local response construction layer.

    Converts intelligence results into structured responses.
    It does not depend on external AI providers.
    """

    def build(
        self,
        pipeline_result: Dict[str, Any],
    ) -> Dict[str, Any]:

        if not isinstance(pipeline_result, dict):
            raise TypeError("pipeline_result must be a dictionary")

        intent = pipeline_result.get("intent", "unknown")
        route = pipeline_result.get("route", "unknown")

        response: Dict[str, Any] = {
            "success": True,
            "intent": intent,
            "route": route,
            "type": "text",
            "content": None,
            "metadata": {},
        }

        if intent == "greeting":
            response["content"] = "مرحبًا! أنا QAI."
            response["metadata"]["source"] = "local"

        elif intent == "knowledge":
            knowledge = pipeline_result.get("knowledge")

            if knowledge is None:
                response["content"] = "لا أملك هذه المعلومة حاليًا."
            else:
                response["content"] = knowledge

            response["metadata"]["source"] = "knowledge"

        elif intent == "reasoning":
            reasoning = pipeline_result.get("reasoning")

            if reasoning:
                response["content"] = reasoning
            else:
                response["content"] = "لا توجد نتيجة استدلال متاحة حاليًا."

            response["metadata"]["source"] = "reasoning"

        elif intent == "learn":
            response["content"] = "تم تحديد الطلب كطلب حفظ معلومة."
            response["metadata"]["source"] = "memory"

        elif intent == "help":
            response["content"] = "تم تحديد الطلب كطلب مساعدة."
            response["metadata"]["source"] = "assistant"

        else:
            response["content"] = "لا أملك إجابة مناسبة لهذا الطلب حاليًا."
            response["metadata"]["source"] = "unknown"

        return response

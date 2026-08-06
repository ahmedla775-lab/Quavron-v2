from vector_memory.search import search
from knowledge.search.search import search_engine


class Retriever:

    def retrieve(self, query, limit=5):

        results = []

        # Vector Memory
        try:
            vector_results = search.search(query)

            for item in vector_results:
                results.append({
                    "text": item.get("text", ""),
                    "score": item.get("score", 0),
                    "source": "vector"
                })

        except Exception:
            pass


        # Knowledge Base
        try:
            knowledge_results = search_engine.search(query)

            for item in knowledge_results:

                value = item.get("value")

                text = ""

                if isinstance(value, dict):

                    content = value.get("content")

                    if isinstance(content, dict):
                        text = content.get("ar", "")

                    elif content:
                        text = str(content)

                    else:
                        title = value.get("title")

                        if isinstance(title, dict):
                            text = title.get("ar", "")

                else:
                    text = str(value)


                if text:
                    results.append({
                        "text": text,
                        "score": item.get("score", 0) + 50,
                        "source": "knowledge"
                    })

        except Exception as e:
            print("knowledge error:", e)


        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )


        # إزالة التكرار + فلترة النتائج الضعيفة
        cleaned = []
        seen = set()

        for item in results:

            if item["text"] in seen:
                continue

            seen.add(item["text"])

            # تجاهل النتائج الضعيفة جداً
            if item["score"] < 5:
                continue

            cleaned.append(item)

        return cleaned[:limit]


retriever = Retriever()

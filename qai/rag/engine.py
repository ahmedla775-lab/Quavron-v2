from rag.retriever import retriever
from rag.context import context


class RAGEngine:

    def prepare(self, question):

        docs = retriever.retrieve(question)

        return {

            "question": question,

            "documents": docs,

            "context": context.build(question, docs)

        }


engine = RAGEngine()

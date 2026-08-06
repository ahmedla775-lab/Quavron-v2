from language.dictionary import dictionary
from policy.engine import engine as policy
from memory.memory import memory
from rag.engine import engine as rag


class Pipeline:

    def process(self, message):

        original = message

        normalized = dictionary.normalize(message)

        memory.remember(
            "last_message",
            original
        )

        retrieval = rag.prepare(normalized)

        return {

            "original": original,

            "normalized": normalized,

            "policy": policy.check("read"),

            "context": retrieval["context"],

            "documents": len(
                retrieval["documents"]
            )

        }


pipeline = Pipeline()

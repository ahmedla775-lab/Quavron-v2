from qai.language.dictionary import dictionary
from qai.policy.engine import engine as policy
from qai.memory.memory import memory
from qai.rag.engine import engine as rag


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

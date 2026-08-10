import json
import os
from datetime import datetime, timezone


DATASET_FILE = os.path.join(
    os.path.dirname(__file__),
    "qai_learning.jsonl"
)


class LearningDataset:

    def add(
        self,
        question,
        answer,
        teacher,
        context="",
        confidence=0.0,
        approved=False
    ):

        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "question": question,
            "answer": answer,
            "teacher": teacher,
            "context": context,
            "confidence": confidence,
            "approved": approved
        }

        os.makedirs(
            os.path.dirname(DATASET_FILE),
            exist_ok=True
        )

        with open(
            DATASET_FILE,
            "a",
            encoding="utf-8"
        ) as f:

            f.write(
                json.dumps(
                    record,
                    ensure_ascii=False
                ) + "\n"
            )

        return record

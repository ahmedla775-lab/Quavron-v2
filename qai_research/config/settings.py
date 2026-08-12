import os


SEARXNG_URL = os.getenv(
    "QAI_RESEARCH_SEARXNG_URL",
    "",
).strip()

SEARXNG_TIMEOUT = int(
    os.getenv(
        "QAI_RESEARCH_SEARXNG_TIMEOUT",
        "15",
    )
)

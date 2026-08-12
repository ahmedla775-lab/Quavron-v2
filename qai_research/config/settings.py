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

class ResearchSettings:
    def __init__(self):
        self.SEARXNG_URL = SEARXNG_URL
        self.SEARXNG_TIMEOUT = SEARXNG_TIMEOUT

        self.REQUEST_TIMEOUT = int(
            os.getenv(
                "QAI_RESEARCH_REQUEST_TIMEOUT",
                "15",
            )
        )

        self.USER_AGENT = os.getenv(
            "QAI_RESEARCH_USER_AGENT",
            "Quavron-QAI-Research/1.0",
        )

        self.WIKIPEDIA_API = os.getenv(
            "QAI_RESEARCH_WIKIPEDIA_API",
            "https://{language}.wikipedia.org/w/api.php",
        )

        self.WIKIPEDIA_LANGUAGES = tuple(
            item.strip()
            for item in os.getenv(
                "QAI_RESEARCH_WIKIPEDIA_LANGUAGES",
                "ar,en,fr",
            ).split(",")
            if item.strip()
        )


settings = ResearchSettings()

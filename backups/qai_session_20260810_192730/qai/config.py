import os

class Settings:

    ENVIRONMENT = os.getenv(
        "ENVIRONMENT",
        "development"
    )

    API_TITLE = "Quavron AI API"

    VERSION = "1.0.0"

    OPENAI_API_KEY = os.getenv(
        "OPENAI_API_KEY"
    )

    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS",
        "*"
    ).split(",")


settings = Settings()

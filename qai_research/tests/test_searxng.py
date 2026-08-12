from qai_research.config.settings import (
    SEARXNG_TIMEOUT,
    SEARXNG_URL,
)
from qai_research.core.models import ResearchRequest
from qai_research.engines.searxng import (
    SearXNGSearchEngine,
)


def main():

    print("===== QAI RESEARCH SEARXNG =====")

    if not SEARXNG_URL:
        print("ERROR: QAI_RESEARCH_SEARXNG_URL is not configured")
        raise SystemExit(1)

    engine = SearXNGSearchEngine(
        base_url=SEARXNG_URL,
        timeout=SEARXNG_TIMEOUT,
    )

    print("URL:", SEARXNG_URL)
    print("Available:", engine.available())

    if engine.last_error:
        print("Error:", engine.last_error)
        raise SystemExit(1)

    request = ResearchRequest(
        query="الذكاء الاصطناعي",
        language="ar",
        max_results=5,
    )

    results = engine.search(request)

    print("Results:", len(results))

    for result in results:
        print()
        print("Rank:", result.rank)
        print("Engine:", result.engine)
        print("Title:", result.title)
        print("URL:", result.url)
        print("Score:", result.score)

    print()
    print("Last error:", engine.last_error)

    if not results:
        raise SystemExit(1)

    print("Success: True")


if __name__ == "__main__":
    main()

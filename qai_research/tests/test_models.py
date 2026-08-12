from qai_research.core.models import (
    ResearchRequest,
    SearchResult,
    PageDocument,
    ResearchResult,
)


def main():
    request = ResearchRequest(
        query="ما هو الذكاء الاصطناعي؟",
        language="ar",
    )

    result = SearchResult(
        title="Artificial intelligence",
        url="https://example.com",
        snippet="Example result",
        engine="test",
        rank=1,
    )

    document = PageDocument(
        url=result.url,
        title=result.title,
        content="Example content",
        source_engine=result.engine,
        fetched=True,
    )

    research = ResearchResult(
        query=request.query,
        search_results=[result],
        documents=[document],
        sources_used=["test"],
        success=True,
    )

    print("===== QAI RESEARCH CORE TEST =====")
    print("Query:", request.query)
    print("Result:", research.search_results[0].title)
    print("Document:", research.documents[0].title)
    print("Success:", research.success)


if __name__ == "__main__":
    main()

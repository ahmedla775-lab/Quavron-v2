from quavron_intelligence.research import ResearchEngine


HTML = {
    "https://example.com/": """
        <html>
        <head><title>Mathematics</title></head>
        <body>
        <h1>Mathematics</h1>
        <p>Mathematics is the study of patterns and structures.</p>
        <a href="/algebra">Algebra</a>
        </body>
        </html>
    """,
    "https://example.com/algebra": """
        <html>
        <head><title>Algebra</title></head>
        <body>
        <h1>Algebra</h1>
        <p>Algebra studies mathematical symbols and rules.</p>
        </body>
        </html>
    """,
}


class FakeSearcher:
    def search(self, query):
        return ["https://example.com/"]


class FakePage:
    def __init__(self, url, html):
        self.url = url
        self.html = html
        self.status_code = 200
        self.content_type = "text/html"
        self.error = None


class FakeFetcher:
    def fetch(self, url):
        if url not in HTML:
            raise ValueError("unknown URL")

        return FakePage(
            url,
            HTML[url],
        )


def test_research_engine_uses_crawler_and_analyzer():
    engine = ResearchEngine(
        searcher=FakeSearcher(),
        reader=FakeFetcher(),
    )

    result = engine.research_text(
        "mathematics"
    )

    assert result.success is True

    assert result.metadata["pages_collected"] == 2
    assert result.metadata["sources_found"] == 2
    assert result.metadata["evidence_count"] >= 1
    assert result.metadata["knowledge_candidates"] >= 1

    assert any(
        "Mathematics is the study"
        in item.statement
        for item in result.knowledge
    )

    assert any(
        "Algebra studies"
        in item.statement
        for item in result.knowledge
    )


def test_research_engine_does_not_require_external_ai():
    engine = ResearchEngine(
        searcher=FakeSearcher(),
        reader=FakeFetcher(),
    )

    result = engine.research_text(
        "mathematics"
    )

    assert result.metadata[
        "external_ai_required"
    ] is False

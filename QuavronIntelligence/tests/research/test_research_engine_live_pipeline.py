from quavron_intelligence.research import ResearchEngine
from quavron_intelligence.research.web import Page


def make_fake_page():
    return Page(
        url="https://example.com/test",
        html="""
        <html>
        <head>
            <title>Example Knowledge</title>
        </head>
        <body>
            <h1>Mathematics</h1>
            <p>
                This page contains useful mathematical information.
            </p>
        </body>
        </html>
        """,
        content="",
        status_code=200,
        content_type="text/html",
        error="",
    )


class FakeSearcher:
    def search(self, query):
        return [
            "https://example.com/test",
        ]


class FakeFetcher:
    def fetch(self, url):
        return make_fake_page()


def test_research_pipeline_collects_source():
    engine = ResearchEngine(
        searcher=FakeSearcher(),
        reader=FakeFetcher(),
    )

    result = engine.research_text(
        "mathematics"
    )

    assert result.success is True
    assert len(result.sources) == 1
    assert result.sources[0].title == (
        "Example Knowledge"
    )
    assert "mathematical information" in (
        result.sources[0].content
    )
    assert len(result.evidence) == 1
    assert len(result.knowledge) == 1

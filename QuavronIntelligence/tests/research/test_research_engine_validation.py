
from quavron_intelligence.research import ResearchEngine
from quavron_intelligence.research.models import KnowledgeItem


class FakeSearcher:
    def search(self, query):
        return ["https://example.com/"]


class FakeFetcher:
    def fetch(self, url):
        from quavron_intelligence.research.web.models import Page

        return Page(
            url=url,
            html="""
            <html>
            <head><title>Mathematics</title></head>
            <body>
                <h1>Mathematics</h1>
                <p>Mathematics is the study of patterns and structures.</p>
            </body>
            </html>
            """,
        )


class RejectingValidator:
    def validate(self, item):
        from quavron_intelligence.research.validator import ValidationResult

        return ValidationResult(
            accepted=False,
            confidence=0.0,
            reason="test_rejection",
            metadata={},
        )


def test_research_engine_excludes_rejected_knowledge():
    engine = ResearchEngine(
        searcher=FakeSearcher(),
        reader=FakeFetcher(),
        validator=RejectingValidator(),
    )

    result = engine.research_text("mathematics")

    assert result.success is True
    assert result.sources
    assert result.evidence
    assert result.knowledge == []

    assert result.metadata["knowledge_validated"] == 0
    assert result.metadata["knowledge_rejected"] >= 1

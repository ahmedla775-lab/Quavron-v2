from quavron_intelligence.knowledge.repository import (
    KnowledgeRepository,
)
from quavron_intelligence.research.engine import ResearchEngine
from quavron_intelligence.research.models import (
    Evidence,
    KnowledgeItem,
    ResearchRequest,
)


class FakeSearcher:
    def search(self, query):
        return ["https://example.com/math"]


class FakeCrawler:
    def crawl(self, urls):
        class Result:
            pages = [
                {
                    "url": "https://example.com/math",
                    "title": "Mathematics",
                    "text": (
                        "Mathematics is the study of patterns "
                        "and structures."
                    ),
                    "status_code": 200,
                    "content_type": "text/html",
                }
            ]

        return Result()


class FakeAnalyzer:
    def analyze_pages(self, pages):
        source = type(
            "Source",
            (),
            {
                "url": "https://example.com/math",
                "title": "Mathematics",
                "source_type": "web",
                "domain": "example.com",
                "content": (
                    "Mathematics is the study of patterns "
                    "and structures."
                ),
                "metadata": {},
            },
        )()

        evidence = Evidence(
            statement=(
                "Mathematics is the study of patterns "
                "and structures."
            ),
            source_url="https://example.com/math",
            confidence=0.7,
        )

        knowledge = KnowledgeItem(
            subject="Mathematics",
            statement=(
                "Mathematics is the study of patterns "
                "and structures."
            ),
            knowledge_type="web_fact",
            confidence=0.7,
            sources=["https://example.com/math"],
            evidence=[evidence],
        )

        return [source], [evidence], [knowledge]


def test_research_text_does_not_store_automatically():
    repository = KnowledgeRepository()

    engine = ResearchEngine(
        searcher=FakeSearcher(),
        analyzer=FakeAnalyzer(),
        crawler=FakeCrawler(),
    )

    result = engine.research(
        ResearchRequest(
            query="mathematics",
            max_sources=1,
        )
    )

    assert result.success is True
    assert result.knowledge
    assert repository.count() == 0

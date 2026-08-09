from quavron_intelligence.research.analyzer import ResearchAnalyzer


def test_analyzer_extracts_source_evidence_and_knowledge():
    analyzer = ResearchAnalyzer()

    pages = [
        {
            "url": "https://example.com/math",
            "title": "Mathematics",
            "text": (
                "Mathematics is the study of patterns and structures. "
                "It is used in science, engineering, and many other fields."
            ),
            "status_code": 200,
            "content_type": "text/html",
        }
    ]

    sources, evidence, knowledge = analyzer.analyze_pages(pages)

    assert len(sources) == 1
    assert sources[0].url == "https://example.com/math"

    assert len(evidence) >= 1
    assert evidence[0].source_url == "https://example.com/math"

    assert len(knowledge) >= 1
    assert knowledge[0].sources == ["https://example.com/math"]


def test_analyzer_ignores_empty_pages():
    analyzer = ResearchAnalyzer()

    sources, evidence, knowledge = analyzer.analyze_pages(
        [
            {
                "url": "https://example.com/empty",
                "title": "Empty",
                "text": "",
            }
        ]
    )

    assert len(sources) == 1
    assert evidence == []
    assert knowledge == []

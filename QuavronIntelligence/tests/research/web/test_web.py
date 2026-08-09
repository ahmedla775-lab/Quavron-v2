from quavron_intelligence.research.web import (
    ContentExtractor,
    Page,
)


HTML = """
<html>
<head>
<title>Quavron Test Page</title>
<style>hidden style</style>
</head>
<body>
<h1>Quavron</h1>
<p>Next generation digital platform.</p>
<script>hidden script</script>
<a href="/courses">Courses</a>
<a href="https://example.com/about">About</a>
</body>
</html>
"""


def test_extract_title():
    extractor = ContentExtractor()

    assert extractor.extract_title(HTML) == "Quavron Test Page"


def test_extract_text():
    extractor = ContentExtractor()

    text = extractor.extract_text(HTML)

    assert "Quavron" in text
    assert "Next generation digital platform." in text
    assert "hidden script" not in text
    assert "hidden style" not in text


def test_extract_links():
    extractor = ContentExtractor()

    links = extractor.extract_links(
        HTML,
        "https://quavron.example/",
    )

    assert "https://quavron.example/courses" in links
    assert "https://example.com/about" in links


def test_extract_page():
    extractor = ContentExtractor()

    page = Page(
        url="https://quavron.example/",
        html=HTML,
    )

    result = extractor.extract(page)

    assert result["title"] == "Quavron Test Page"
    assert "Next generation digital platform." in result["text"]
    assert len(result["links"]) == 2

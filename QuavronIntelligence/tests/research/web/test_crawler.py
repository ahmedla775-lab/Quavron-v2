from quavron_intelligence.research.web import (
    ContentExtractor,
    Page,
    WebCrawler,
)


HTML_PAGES = {
    "https://quavron.example/": """
    <html>
    <head><title>Home</title></head>
    <body>
        <h1>Quavron</h1>
        <p>Digital platform.</p>
        <a href="/courses">Courses</a>
        <a href="/community">Community</a>
    </body>
    </html>
    """,
    "https://quavron.example/courses": """
    <html>
    <head><title>Courses</title></head>
    <body>
        <h1>Courses</h1>
        <p>Learning content.</p>
        <a href="/">Home</a>
    </body>
    </html>
    """,
    "https://quavron.example/community": """
    <html>
    <head><title>Community</title></head>
    <body>
        <h1>Community</h1>
        <p>Community content.</p>
    </body>
    </html>
    """,
}


class FakeFetcher:
    def fetch(self, url):
        if url not in HTML_PAGES:
            raise ValueError("unknown URL")

        return Page(
            url=url,
            html=HTML_PAGES[url],
        )


def test_crawler_collects_multiple_pages():
    crawler = WebCrawler(
        fetcher=FakeFetcher(),
        extractor=ContentExtractor(),
        max_pages=3,
    )

    result = crawler.crawl(
        ["https://quavron.example/"]
    )

    assert len(result.pages) == 3
    assert result.metadata["pages_crawled"] == 3


def test_crawler_stays_on_same_domain():
    crawler = WebCrawler(
        fetcher=FakeFetcher(),
        extractor=ContentExtractor(),
        max_pages=10,
        same_domain=True,
    )

    result = crawler.crawl(
        ["https://quavron.example/"]
    )

    for page in result.pages:
        assert "quavron.example" in page["url"]


def test_crawler_avoids_duplicate_pages():
    crawler = WebCrawler(
        fetcher=FakeFetcher(),
        extractor=ContentExtractor(),
        max_pages=10,
    )

    result = crawler.crawl(
        ["https://quavron.example/"]
    )

    assert len(result.visited) == len(set(result.visited))


def test_crawler_empty_input():
    crawler = WebCrawler(
        fetcher=FakeFetcher(),
        extractor=ContentExtractor(),
    )

    result = crawler.crawl([])

    assert result.pages == []
    assert result.metadata["status"] == "empty"

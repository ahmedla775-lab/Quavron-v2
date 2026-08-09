from __future__ import annotations

from typing import Any
from urllib.parse import urlparse

from ..knowledge.repository import KnowledgeRepository
from .analyzer import ResearchAnalyzer
from .validator import ResearchValidator
from .models import (
    Evidence,
    KnowledgeItem,
    ResearchRequest,
    ResearchResult,
    ResearchSource,
)
from .web import (
    ContentExtractor,
    WebCrawler,
    WebFetcher,
    WebSearcher,
)


class ResearchEngine:
    """
    Quavron local knowledge research engine.

    Pipeline:

        question
            ↓
        web search
            ↓
        source selection
            ↓
        multi-page crawling
            ↓
        content extraction
            ↓
        local analysis
            ↓
        evidence
            ↓
        knowledge candidates
            ↓
        QAI / RAG / knowledge storage

    No external AI model is required for acquisition.
    """

    def __init__(
        self,
        searcher: Any = None,
        reader: Any = None,
        extractor: Any = None,
        analyzer: Any = None,
        validator: Any = None,
        knowledge_builder: Any = None,
        crawler: Any = None,
        knowledge_repository: KnowledgeRepository | None = None,
    ):
        self.searcher = searcher or WebSearcher()
        self.reader = reader or WebFetcher()
        self.extractor = extractor or ContentExtractor()
        self.analyzer = analyzer or ResearchAnalyzer()

        self.validator = validator or ResearchValidator()
        self.knowledge_builder = knowledge_builder
        self.crawler = crawler

        # Repository for validated research-derived knowledge.
        # Research knowledge is stored only after validation.
        self.knowledge_repository = (
            knowledge_repository
            if knowledge_repository is not None
            else KnowledgeRepository()
        )

    def research(
        self,
        request: ResearchRequest,
    ) -> ResearchResult:
        if not isinstance(request, ResearchRequest):
            raise TypeError(
                "request must be a ResearchRequest"
            )

        query = request.query.strip()

        if not query:
            return ResearchResult(
                query="",
                success=False,
                summary="Research query cannot be empty.",
                metadata={
                    "reason": "empty_query",
                },
            )

        urls = self._discover_sources(
            query,
            request.max_sources,
        )

        if not urls:
            return ResearchResult(
                query=query,
                success=False,
                summary="No accessible web sources were found for the query.",
                metadata={
                    "status": "completed",
                    "external_ai_required": False,
                    "sources_found": 0,
                    "evidence_count": 0,
                    "knowledge_candidates": 0,
                },
            )

        pages = self._crawl_sources(
            urls,
            max_pages=max(
                request.max_sources,
                len(urls) + 1,
            ),
        )

        sources, evidence, knowledge = (
            self.analyzer.analyze_pages(pages)
        )

        validated_knowledge: list[KnowledgeItem] = []
        rejected_knowledge: list[dict[str, Any]] = []

        for item in knowledge:
            validation = self.validator.validate(item)

            if validation.accepted:
                validated_knowledge.append(item)
            else:
                rejected_knowledge.append(
                    {
                        "reason": validation.reason,
                        "confidence": validation.confidence,
                        "statement": str(
                            getattr(item, "statement", "")
                        ),
                    }
                )

        knowledge = validated_knowledge

        # Store only validated research knowledge.
        #
        # The adapter is imported lazily here to avoid a circular
        # import through quavron_intelligence.research.__init__.
        if knowledge:
            from ..knowledge.research_adapter import (
                ResearchKnowledgeAdapter,
            )

            adapter = ResearchKnowledgeAdapter()

            for item in knowledge:
                adapted = adapter.adapt(item)
                self.knowledge_repository.add_research(adapted)

        success = bool(sources)

        if success:
            summary = (
                f"Research collected {len(sources)} "
                f"web source(s), generated "
                f"{len(knowledge)} validated "
                f"knowledge candidate(s), and rejected "
                f"{len(rejected_knowledge)} candidate(s)."
            )
        else:
            summary = (
                "No accessible web sources were found "
                "for the query."
            )

        return ResearchResult(
            query=query,
            success=success,
            sources=sources,
            evidence=evidence,
            knowledge=knowledge,
            summary=summary,
            metadata={
                "status": "completed",
                "external_ai_required": False,
                "sources_found": len(sources),
                "evidence_count": len(evidence),
                "knowledge_candidates": len(knowledge),
                "knowledge_validated": len(knowledge),
                "knowledge_rejected": len(rejected_knowledge),
                "pages_collected": len(pages),
                "search_results": len(urls),
            },
        )

    def research_text(
        self,
        query: str,
    ) -> ResearchResult:
        return self.research(
            ResearchRequest(query=query)
        )

    def research_and_store(
        self,
        request: ResearchRequest,
    ) -> ResearchResult:
        """
        Research the web and explicitly store only validated
        knowledge candidates in the local knowledge repository.

        Normal research() never writes to the repository.
        """
        result = self.research(request)

        if not result.success:
            result.metadata["knowledge_stored"] = 0
            return result

        stored = 0
        storage_errors = 0

        for item in result.knowledge:
            try:
                adapted = self.knowledge_adapter.adapt(item)

                if self.knowledge_repository.add_research(adapted):
                    stored += 1
            except Exception:
                storage_errors += 1

        result.metadata["knowledge_stored"] = stored
        result.metadata["knowledge_storage_errors"] = storage_errors

        return result

    def _discover_sources(
        self,
        query: str,
        max_sources: int,
    ) -> list[str]:
        max_sources = max(
            1,
            min(int(max_sources or 5), 20),
        )

        try:
            urls = self.searcher.search(query)
        except Exception:
            urls = []

        result: list[str] = []
        seen: set[str] = set()

        for url in urls:
            if not self._valid_http_url(url):
                continue

            if url in seen:
                continue

            seen.add(url)
            result.append(url)

            if len(result) >= max_sources:
                break

        return result

    def _crawl_sources(
        self,
        urls: list[str],
        max_pages: int = 10,
    ) -> list[dict[str, Any]]:
        """
        Crawl each discovered source independently.

        Each source gets its own domain boundary. This prevents
        the first search result from controlling the entire crawl.
        """

        pages: list[dict[str, Any]] = []
        seen: set[str] = set()

        budget = max(
            1,
            min(int(max_pages or 5), 20),
        )

        for url in urls:
            if len(pages) >= budget:
                break

            remaining = budget - len(pages)

            crawler = self.crawler

            if crawler is None:
                crawler = WebCrawler(
                    fetcher=self.reader,
                    extractor=self.extractor,
                    max_pages=remaining,
                    same_domain=True,
                )

            try:
                result = crawler.crawl([url])
            except Exception:
                continue

            for page in result.pages:
                page_url = str(
                    page.get("url", "")
                ).strip()

                if not page_url:
                    continue

                if page_url in seen:
                    continue

                seen.add(page_url)
                pages.append(page)

                if len(pages) >= budget:
                    break

        return pages

    def _read_source(
        self,
        url: str,
    ) -> ResearchSource | None:
        """
        Backward-compatible single-page reader.

        Kept intentionally because existing integrations may
        call this method directly.
        """

        try:
            page = self.reader.fetch(url)
            extracted = self.extractor.extract(page)
        except Exception:
            return None

        final_url = extracted.get("url") or url

        title = str(
            extracted.get("title") or ""
        ).strip()

        text = str(
            extracted.get("text") or ""
        ).strip()

        domain = urlparse(final_url).netloc

        return ResearchSource(
            url=final_url,
            title=title,
            source_type="web",
            domain=domain,
            content=text,
            metadata={
                "status_code": extracted.get(
                    "status_code"
                ),
                "content_type": extracted.get(
                    "content_type"
                ),
                "links": extracted.get(
                    "links",
                    [],
                ),
            },
        )

    @staticmethod
    def _valid_http_url(url: str) -> bool:
        try:
            parsed = urlparse(url)

            return (
                parsed.scheme in {
                    "http",
                    "https",
                }
                and bool(parsed.netloc)
            )
        except Exception:
            return False

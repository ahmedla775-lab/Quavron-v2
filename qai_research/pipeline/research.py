from typing import Optional

from qai_research.core.models import (
    ResearchRequest,
    ResearchResult,
)

from qai_research.core.source_manager import (
    SourceManager,
)

from qai_research.extractors.html import (
    HTMLExtractor,
)

from qai_research.security.source_policy import (
    SourcePolicy,
)

from qai_research.storage.json_store import (
    JSONResearchStore,
)


class ResearchPipeline:
    """
    خط البحث الفعلي لمنظومة QAI Research.

    المسار:

    Query
        ↓
    SourceManager
        ↓
    Relevance Filter
        ↓
    Source Security
        ↓
    HTTP Fetch
        ↓
    HTML Extraction
        ↓
    Storage

    هذه الطبقة لا تتصل مباشرة بـ QAI.
    """

    name = "research_pipeline"

    def __init__(
        self,
        source_manager: SourceManager,
        fetcher,
        extractor: Optional[HTMLExtractor] = None,
        source_policy: Optional[SourcePolicy] = None,
        store: Optional[JSONResearchStore] = None,
    ):
        self.source_manager = source_manager

        self.fetcher = fetcher

        self.extractor = (
            extractor
            or HTMLExtractor()
        )

        self.source_policy = (
            source_policy
            or SourcePolicy()
        )

        self.store = (
            store
            or JSONResearchStore()
        )

    def research(
        self,
        request: ResearchRequest,
    ) -> ResearchResult:

        search_results, search_errors = (
            self.source_manager.search(
                request
            )
        )

        result = ResearchResult(
            query=request.query,
            search_results=list(
                search_results
            ),
            errors=list(
                search_errors
            ),
            sources_used=list(
                self.source_manager.sources_used
            ),
        )

        if not result.search_results:
            result.success = False

            result.metadata.update(
                {
                    "pages_requested": request.max_pages,
                    "pages_fetched": 0,
                    "pages_rejected": 0,
                    "documents_stored": 0,
                }
            )

            self.store.save_research(
                result
            )

            return result

        max_pages = max(
            0,
            int(request.max_pages),
        )

        fetched_count = 0

        for search_result in result.search_results:

            if fetched_count >= max_pages:
                break

            url = str(
                search_result.url or ""
            ).strip()

            if not url:
                continue

            decision = (
                self.source_policy.evaluate(
                    url
                )
            )

            if not decision.allowed:

                result.rejected_urls.append(
                    url
                )

                continue

            try:

                document = self.fetcher.fetch(
                    url
                )

            except Exception as exc:

                result.errors.append(
                    f"fetch {url}: "
                    f"{type(exc).__name__}: "
                    f"{exc}"
                )

                continue

            if not document.fetched:

                result.errors.append(
                    f"fetch failed: {url}"
                )

                continue

            document.source_engine = (
                search_result.engine
            )

            document.metadata.update(
                {
                    "search_title":
                        search_result.title,

                    "search_rank":
                        search_result.rank,

                    "search_score":
                        search_result.score,

                    "source_domain":
                        decision.domain,
                }
            )

            try:

                document = (
                    self.extractor.extract(
                        document
                    )
                )

            except Exception as exc:

                result.errors.append(
                    f"extract {url}: "
                    f"{type(exc).__name__}: "
                    f"{exc}"
                )

                continue

            if not document.content:

                result.errors.append(
                    f"empty extracted content: "
                    f"{url}"
                )

                continue

            saved = self.store.save_document(
                document
            )

            if not saved:

                result.errors.append(
                    f"storage failed: {url}"
                )

                continue

            result.documents.append(
                document
            )

            fetched_count += 1

        result.metadata.update(
            {
                "pages_requested":
                    max_pages,

                "pages_fetched":
                    fetched_count,

                "pages_rejected":
                    len(
                        result.rejected_urls
                    ),

                "documents_stored":
                    len(
                        result.documents
                    ),
            }
        )

        result.success = bool(
            result.documents
        )

        self.store.save_research(
            result
        )

        return result


def build_pipeline(
    source_manager,
    fetcher,
):
    """
    إنشاء ResearchPipeline بالإعدادات الافتراضية.
    """

    return ResearchPipeline(
        source_manager=source_manager,
        fetcher=fetcher,
    )

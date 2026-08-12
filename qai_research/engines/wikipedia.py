import json
import re
import urllib.error
import urllib.parse
import urllib.request
from typing import List

from qai_research.config import settings
from qai_research.core.models import (
    ResearchRequest,
    SearchResult,
)
from qai_research.engines.base import SearchEngine


class WikipediaSearchEngine(SearchEngine):

    name = "wikipedia"
    priority = 20

    def available(self) -> bool:
        return True

    # =========================================================
    # NORMALIZATION
    # =========================================================

    def _normalize(self, text):
        text = str(text or "").lower()

        replacements = {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ة": "ه",
            "ى": "ي",
        }

        for source, target in replacements.items():
            text = text.replace(source, target)

        text = re.sub(
            r"[^\w\s\u0600-\u06ff-]",
            " ",
            text,
        )

        return re.sub(
            r"\s+",
            " ",
            text,
        ).strip()

    # =========================================================
    # QUESTION CLEANING
    # =========================================================

    def _clean_query(self, query):

        query = str(query or "").strip()

        prefixes = (
            "ما هو ",
            "ما هي ",
            "ما معنى ",
            "ما المقصود ب",
            "من هو ",
            "من هي ",
            "what is ",
            "what are ",
            "who is ",
            "what does ",
            "qu est ce que ",
            "qu est-ce que ",
            "qui est ",
            "quelle est ",
            "quel est ",
        )

        normalized = self._normalize(query)

        for prefix in prefixes:
            if normalized.startswith(prefix):
                normalized = normalized[
                    len(prefix):
                ].strip()
                break

        normalized = normalized.replace(
            "؟",
            " ",
        ).replace(
            "?",
            " ",
        )

        return re.sub(
            r"\s+",
            " ",
            normalized,
        ).strip()

    # =========================================================
    # TERMS
    # =========================================================

    def _terms(self, text):

        stop_words = {
            "ما", "هو", "هي", "هل",
            "من", "عن", "في", "الى",
            "على", "كيف", "ماذا",
            "لماذا", "متى", "اين",
            "what", "is", "are",
            "the", "a", "an",
            "who", "how", "why",
            "de", "la", "le",
            "les", "un", "une",
            "est", "qui", "que",
        }

        return [
            word
            for word in self._normalize(text).split()
            if len(word) >= 2
            and word not in stop_words
        ]

    # =========================================================
    # RELEVANCE
    # =========================================================

    def _relevance(
        self,
        query,
        title,
        snippet,
    ):

        clean_query = self._clean_query(
            query
        )

        normalized_query = self._normalize(
            clean_query
        )

        normalized_title = self._normalize(
            title
        )

        normalized_snippet = self._normalize(
            snippet
        )

        query_terms = self._terms(
            clean_query
        )

        if not query_terms:
            return 0.0

        score = 0.0

        # -----------------------------------------------------
        # Exact phrase
        # -----------------------------------------------------

        if normalized_query == normalized_title:
            score += 100.0

        elif (
            normalized_query
            and normalized_query
            in normalized_title
        ):
            score += 60.0

        # -----------------------------------------------------
        # Title terms
        # -----------------------------------------------------

        matched_title_terms = 0

        for term in query_terms:

            if term in normalized_title:

                matched_title_terms += 1

                # Longer terms are more informative.
                score += min(
                    len(term) * 2.0,
                    20.0,
                )

        # -----------------------------------------------------
        # Full query coverage
        # -----------------------------------------------------

        if query_terms:

            coverage = (
                matched_title_terms
                / len(query_terms)
            )

            score += coverage * 40.0

        # -----------------------------------------------------
        # Snippet support
        # -----------------------------------------------------

        for term in query_terms:

            if term in normalized_snippet:
                score += 2.0

        return round(
            score,
            4,
        )

    # =========================================================
    # LANGUAGES
    # =========================================================

    def _languages(self, request):

        requested = self._normalize(
            request.language or ""
        )

        language = (
            requested
            if requested
            in settings.WIKIPEDIA_LANGUAGES
            else None
        )

        if language:

            return [
                language,
                *[
                    lang
                    for lang
                    in settings.WIKIPEDIA_LANGUAGES
                    if lang != language
                ],
            ]

        return list(
            settings.WIKIPEDIA_LANGUAGES
        )

    # =========================================================
    # API
    # =========================================================

    def _search_language(
        self,
        query,
        language,
        limit,
        exact=False,
    ):

        search_query = query

        if exact:
            search_query = (
                '"' + query + '"'
            )

        params = {
            "action": "query",
            "list": "search",
            "srsearch": search_query,
            "format": "json",
            "utf8": "1",
            "srlimit": str(limit),
        }

        url = (
            settings.WIKIPEDIA_API.format(
                language=language
            )
            + "?"
            + urllib.parse.urlencode(
                params
            )
        )

        http_request = urllib.request.Request(
            url,
            headers={
                "User-Agent":
                    settings.USER_AGENT,
                "Accept":
                    "application/json",
            },
        )

        with urllib.request.urlopen(
            http_request,
            timeout=settings.REQUEST_TIMEOUT,
        ) as response:

            raw = response.read()

        data = json.loads(
            raw.decode(
                "utf-8",
                errors="replace",
            )
        )

        return data.get(
            "query",
            {},
        ).get(
            "search",
            [],
        )

    # =========================================================
    # SEARCH
    # =========================================================

    def search(
        self,
        request: ResearchRequest,
    ) -> List[SearchResult]:

        self.reset_error()

        raw_query = str(
            request.query or ""
        ).strip()

        if not raw_query:
            return []

        query = self._clean_query(
            raw_query
        )

        if not query:
            return []

        languages = self._languages(
            request
        )

        candidates = []

        # =====================================================
        # PHASE 1
        # Exact search in requested language
        # =====================================================

        primary_language = languages[0]

        try:

            exact_items = self._search_language(
                query=query,
                language=primary_language,
                limit=request.max_results,
                exact=True,
            )

            for item in exact_items:
                candidates.append(
                    (
                        primary_language,
                        item,
                        True,
                    )
                )

        except (
            urllib.error.URLError,
            urllib.error.HTTPError,
            TimeoutError,
            OSError,
            ValueError,
        ) as exc:

            self.set_error(exc)

        # =====================================================
        # PHASE 2
        # Normal search in requested language
        # =====================================================

        try:

            normal_items = self._search_language(
                query=query,
                language=primary_language,
                limit=request.max_results,
                exact=False,
            )

            for item in normal_items:
                candidates.append(
                    (
                        primary_language,
                        item,
                        False,
                    )
                )

        except (
            urllib.error.URLError,
            urllib.error.HTTPError,
            TimeoutError,
            OSError,
            ValueError,
        ) as exc:

            self.set_error(exc)

        # =====================================================
        # Score primary language first
        # =====================================================

        scored = []

        for language, item, exact in candidates:

            title = str(
                item.get(
                    "title",
                    "",
                )
            ).strip()

            if not title:
                continue

            snippet = re.sub(
                r"<[^>]+>",
                "",
                str(
                    item.get(
                        "snippet",
                        "",
                    )
                ),
            )

            score = self._relevance(
                query,
                title,
                snippet,
            )

            if exact:
                score += 15.0

            page_url = (
                "https://"
                + language
                + ".wikipedia.org/wiki/"
                + urllib.parse.quote(
                    title.replace(
                        " ",
                        "_",
                    ),
                    safe="()_,-.",
                )
            )

            scored.append(
                SearchResult(
                    title=title,
                    url=page_url,
                    snippet=snippet,
                    engine=self.name,
                    score=score,
                    metadata={
                        "language": language,
                        "pageid": item.get(
                            "pageid"
                        ),
                        "exact_search": exact,
                    },
                )
            )

        # =====================================================
        # Deduplicate primary language
        # =====================================================

        unique = []
        seen = set()

        for item in scored:

            key = item.url.lower().rstrip("/")

            if key in seen:
                continue

            seen.add(key)
            unique.append(item)

        unique.sort(
            key=lambda item: item.score,
            reverse=True,
        )

        # =====================================================
        # IMPORTANT:
        # If the requested language already provides useful
        # results, do not pollute them with weak fallback
        # language results.
        # =====================================================

        strong_primary = [
            item
            for item in unique
            if item.score >= 35
        ]

        if len(strong_primary) >= min(
            request.max_results,
            3,
        ):

            final = strong_primary[
                :request.max_results
            ]

        else:

            final = unique[
                :request.max_results
            ]

            # -------------------------------------------------
            # Only now use other languages.
            # -------------------------------------------------

            if len(final) < request.max_results:

                for language in languages[1:]:

                    try:

                        items = self._search_language(
                            query=query,
                            language=language,
                            limit=request.max_results,
                            exact=False,
                        )

                    except (
                        urllib.error.URLError,
                        urllib.error.HTTPError,
                        TimeoutError,
                        OSError,
                        ValueError,
                    ) as exc:

                        self.set_error(exc)
                        continue

                    for item in items:

                        title = str(
                            item.get(
                                "title",
                                "",
                            )
                        ).strip()

                        if not title:
                            continue

                        snippet = re.sub(
                            r"<[^>]+>",
                            "",
                            str(
                                item.get(
                                    "snippet",
                                    "",
                                )
                            ),
                        )

                        score = self._relevance(
                            query,
                            title,
                            snippet,
                        )

                        if score <= 0:
                            continue

                        page_url = (
                            "https://"
                            + language
                            + ".wikipedia.org/wiki/"
                            + urllib.parse.quote(
                                title.replace(
                                    " ",
                                    "_",
                                ),
                                safe="()_,-.",
                            )
                        )

                        key = (
                            page_url
                            .lower()
                            .rstrip("/")
                        )

                        if key in seen:
                            continue

                        seen.add(key)

                        final.append(
                            SearchResult(
                                title=title,
                                url=page_url,
                                snippet=snippet,
                                engine=self.name,
                                score=score,
                                metadata={
                                    "language": language,
                                    "pageid": item.get(
                                        "pageid"
                                    ),
                                },
                            )
                        )

                        if len(final) >= request.max_results:
                            break

                    if len(final) >= request.max_results:
                        break

        # =====================================================
        # FINAL RANKING
        # =====================================================

        final.sort(
            key=lambda item: item.score,
            reverse=True,
        )

        for index, item in enumerate(
            final,
            start=1,
        ):
            item.rank = index

        return final

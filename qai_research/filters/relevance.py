import re
from typing import List

from qai_research.core.models import SearchResult


class RelevanceFilter:
    """
    بوابة الصلة النهائية لنتائج البحث.

    Discovery مسؤول عن صحة محرك البحث.
    هذا المكون مسؤول عن سؤال المستخدم نفسه.

    القاعدة المهمة:
    لا نقبل نتيجة لمجرد وجود تطابق جزئي ضعيف.
    """

    STOPWORDS = {
        # English
        "the", "and", "for", "with", "from",
        "this", "that", "what", "who", "where",
        "how", "are", "was", "is", "about",
        "can", "does", "do", "a", "an", "to",
        "of", "in", "on", "at", "as",

        # Arabic
        "من", "في", "على", "عن", "إلى", "الى",
        "ما", "هو", "هي", "هل", "كيف",
        "لماذا", "أين", "ماذا", "متى",
        "و", "أو", "يا",
        "الذي", "التي",
        "هذا", "هذه", "ذلك", "تلك",
        "مع",

        # French
        "de", "des", "les", "une", "dans",
        "pour", "avec", "que", "qui",
        "est", "sur", "et",
    }

    def __init__(
        self,
        minimum_score: float = 0.30,
    ):
        self.minimum_score = minimum_score

    # =========================================================
    # NORMALIZATION
    # =========================================================

    @staticmethod
    def _normalize(text: str) -> str:
        text = str(text or "").lower()

        # Arabic diacritics
        text = re.sub(
            r"[\u064B-\u065F\u0670]",
            "",
            text,
        )

        # Arabic letter normalization
        text = (
            text
            .replace("أ", "ا")
            .replace("إ", "ا")
            .replace("آ", "ا")
            .replace("ٱ", "ا")
            .replace("ى", "ي")
            .replace("ؤ", "و")
            .replace("ئ", "ي")
        )

        # punctuation -> spaces
        text = re.sub(
            r"[^\w\u0600-\u06FF]+",
            " ",
            text,
            flags=re.UNICODE,
        )

        text = re.sub(
            r"\s+",
            " ",
            text,
        ).strip()

        return text

    def _tokens(self, text: str):
        normalized = self._normalize(text)

        tokens = set()

        for token in normalized.split():
            if not token:
                continue

            if token in self.STOPWORDS:
                continue

            # Ignore extremely short noise tokens.
            if len(token) < 2:
                continue

            tokens.add(token)

        return tokens

    # =========================================================
    # FILTER
    # =========================================================

    def filter(
        self,
        query: str,
        results: List[SearchResult],
        query_variants=None,
    ) -> List[SearchResult]:

        accepted = []

        query = str(query or "").strip()

        # The original query is always the first and strongest authority.
        candidate_queries = [query]

        # Additional variants represent legitimate reformulations of the
        # same intent. They may be multilingual, quoted, entity-focused,
        # topic-focused, or company-specific.
        for variant in (query_variants or []):
            variant = str(variant or "").strip()

            if not variant:
                continue

            if variant not in candidate_queries:
                candidate_queries.append(variant)

        if not self._tokens(query):
            return []

        for result in results:

            best_score = 0.0
            best_query = query

            for candidate_query in candidate_queries:

                candidate_tokens = self._tokens(candidate_query)
                candidate_normalized = self._normalize(candidate_query)

                if not candidate_tokens:
                    continue

                candidate_score = self._score(
                    candidate_tokens,
                    candidate_normalized,
                    result,
                )

                if candidate_score > best_score:
                    best_score = candidate_score
                    best_query = candidate_query

            # Keep the original user query as the primary identity signal
            # whenever it has meaningful evidence. A variant may rescue
            # multilingual/entity searches, but must not erase strong
            # evidence from the original query.
            original_tokens = self._tokens(query)

            if original_tokens:
                original_score = self._score(
                    original_tokens,
                    self._normalize(query),
                    result,
                )

                if original_score >= 0.50:
                    best_score = max(
                        original_score,
                        best_score,
                    )
                    if original_score >= best_score:
                        best_query = query

            score = best_score

            result.metadata["relevance_score"] = score
            result.metadata["relevance_query"] = best_query

            result.relevance = score

            if score >= self.minimum_score:
                accepted.append(result)

        accepted.sort(
            key=lambda item: (
                item.metadata.get(
                    "relevance_score",
                    0.0,
                ),
                float(item.score or 0.0),
            ),
            reverse=True,
        )

        for rank, result in enumerate(
            accepted,
            1,
        ):
            result.rank = rank

        return accepted

    # =========================================================
    # SCORING
    # =========================================================

    def _score(
        self,
        query_tokens,
        query_normalized,
        result: SearchResult,
    ) -> float:

        if not query_tokens:
            return 0.0

        title = self._normalize(result.title)
        snippet = self._normalize(result.snippet)
        url = self._normalize(result.url)

        title_tokens = self._tokens(title)
        snippet_tokens = self._tokens(snippet)
        url_tokens = self._tokens(url)

        total = len(query_tokens)

        # ---------------------------------------------------------
        # Metadata
        # ---------------------------------------------------------

        purpose = str(
            result.metadata.get("purpose", "")
        ).lower()

        variant = str(
            result.metadata.get("variant", "")
        ).lower()

        engine = str(
            result.engine or ""
        ).lower()

        # ---------------------------------------------------------
        # Exact phrase
        # ---------------------------------------------------------

        if query_normalized:
            if query_normalized == title:
                return 1.0

            if query_normalized in title:
                # The requested entity appears inside a longer title.
                # This is related evidence, not an exact entity match.
                #
                # Example:
                #   query  = "ألبرت أينشتاين"
                #   title  = "هانز ألبرت أينشتاين"
                #
                # Keep the result, but clearly below an exact entity page.
                return 0.68

            if query_normalized in snippet:
                return 0.78

        # ---------------------------------------------------------
        # Exact token overlap
        # ---------------------------------------------------------

        title_hits = len(
            query_tokens & title_tokens
        )

        snippet_hits = len(
            query_tokens & snippet_tokens
        )

        url_hits = len(
            query_tokens & url_tokens
        )

        title_score = title_hits / total
        snippet_score = snippet_hits / total
        url_score = url_hits / total

        # ---------------------------------------------------------
        # Strong identity matching
        #
        # Example:
        # query entity = "ألبرت أينشتاين"
        #
        # "ألبرت أينشتاين"                  -> exact entity
        # "هانز ألبرت أينشتاين"             -> not exact entity
        # "إدوارد ألبرت أينشتاين"           -> not exact entity
        # ---------------------------------------------------------

        if total >= 2:

            # Exact complete token set in title.
            if (
                title_tokens == query_tokens
                and title_score == 1.0
            ):
                return 1.0

            # Exact query phrase at the beginning of a longer title
            # should remain strong, but below an exact entity page.
            if (
                title_score == 1.0
                and query_normalized
                and title.startswith(query_normalized)
            ):
                return 0.90

            # If the title contains all query tokens but has
            # additional identity words, penalize it.
            if title_score == 1.0 and title_tokens != query_tokens:
                return 0.72

            # Strong but incomplete title match.
            if title_score >= 0.75:
                return 0.82

            if title_score >= 0.50:
                return 0.68

            if snippet_score >= 0.75:
                return 0.64

        # ---------------------------------------------------------
        # Wikipedia identity protection
        #
        # When an entity variant was generated explicitly, an exact
        # Wikipedia title should beat generic pages mentioning it.
        # ---------------------------------------------------------

        if (
            purpose == "wikipedia"
            and total >= 2
            and title_tokens == query_tokens
        ):
            return 1.0

        # ---------------------------------------------------------
        # Normal weighted score
        # ---------------------------------------------------------

        score = (
            title_score * 0.65
            + snippet_score * 0.30
            + url_score * 0.05
        )

        # ---------------------------------------------------------
        # Partial matching
        # ---------------------------------------------------------

        partial_hits = 0

        combined_tokens = (
            title_tokens
            | snippet_tokens
            | url_tokens
        )

        for qtoken in query_tokens:

            if qtoken in combined_tokens:
                continue

            if len(qtoken) < 4:
                continue

            for token in combined_tokens:

                if len(token) < 4:
                    continue

                if (
                    token.startswith(qtoken)
                    or qtoken.startswith(token)
                ):
                    partial_hits += 1
                    break

        if partial_hits:

            partial_score = (
                partial_hits / total
            )

            if title_hits or snippet_hits:
                score = max(
                    score,
                    partial_score * 0.45,
                )

        # ---------------------------------------------------------
        # Critical anti-noise rule
        # ---------------------------------------------------------

        exact_hits = (
            title_hits
            + snippet_hits
        )

        # Company/entity searches may legitimately have the entity
        # only in the title or URL. Keep the exact-title case above.
        if exact_hits == 0:

            # Allow explicit company variants when the company name
            # appears in URL/title metadata.
            if purpose.startswith("company_"):
                company_terms = set(
                    self._tokens(
                        query_normalized
                    )
                )

                if company_terms & (
                    title_tokens | url_tokens
                ):
                    return 0.60

            return 0.0

        # ---------------------------------------------------------
        # Multiple-token coverage
        # ---------------------------------------------------------

        if total >= 2:

            coverage = (
                title_hits
                + snippet_hits
            ) / (2 * total)

            # Only one tiny match in a long query is weak.
            if (
                title_hits == 0
                and snippet_hits == 1
                and total >= 3
            ):
                score = min(
                    score,
                    0.20,
                )

        # ---------------------------------------------------------
        # Single-token query
        # ---------------------------------------------------------

        if total == 1:

            token = next(
                iter(query_tokens)
            )

            if token in title_tokens:
                score = max(
                    score,
                    0.85,
                )

            elif token in snippet_tokens:
                score = max(
                    score,
                    0.55,
                )

            elif (
                token in url_tokens
                and purpose.startswith("company_")
            ):
                score = max(
                    score,
                    0.60,
                )

            else:
                score = 0.0

        return round(
            max(
                0.0,
                min(score, 1.0),
            ),
            4,
        )


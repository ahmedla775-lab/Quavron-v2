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
    ) -> List[SearchResult]:

        accepted = []

        query_tokens = self._tokens(query)
        query_normalized = self._normalize(query)

        if not query_tokens:
            return []

        for result in results:

            score = self._score(
                query_tokens,
                query_normalized,
                result,
            )

            result.metadata["relevance_score"] = score
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

        # -----------------------------------------------------
        # Exact phrase
        # -----------------------------------------------------

        if (
            query_normalized
            and query_normalized in title
        ):
            return 1.0

        if (
            query_normalized
            and query_normalized in snippet
        ):
            return 0.80

        # -----------------------------------------------------
        # Exact token overlap
        # -----------------------------------------------------

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

        # -----------------------------------------------------
        # Strong identity/name matching
        #
        # For questions like:
        # من هو آلان تورنغ؟
        #
        # We expect the important name tokens to appear.
        # -----------------------------------------------------

        if total >= 2:

            if title_score >= 0.75:
                return 0.90

            if title_score >= 0.50:
                return 0.75

            # Two or more query tokens in snippet
            # is meaningful evidence.
            if snippet_score >= 0.75:
                return 0.70

        # -----------------------------------------------------
        # Normal weighted score
        # -----------------------------------------------------

        score = (
            title_score * 0.65
            + snippet_score * 0.30
            + url_score * 0.05
        )

        # -----------------------------------------------------
        # Partial matching
        #
        # ONLY allow partial matching when there is already
        # meaningful evidence in title/snippet.
        #
        # This prevents random words from becoming relevant.
        # -----------------------------------------------------

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

                # Prefix/suffix matching only.
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

            # Partial matching alone must never
            # create a strong result.
            if title_hits or snippet_hits:
                score = max(
                    score,
                    partial_score * 0.45,
                )

        # -----------------------------------------------------
        # Critical anti-noise rule
        #
        # A result with ZERO exact query-token overlap
        # cannot be accepted just because of URL/partial noise.
        # -----------------------------------------------------

        exact_hits = (
            title_hits
            + snippet_hits
        )

        if exact_hits == 0:
            return 0.0

        # -----------------------------------------------------
        # Query with multiple meaningful tokens
        #
        # Require at least some reasonable coverage.
        # -----------------------------------------------------

        if total >= 2:

            coverage = (
                title_hits
                + snippet_hits
            ) / (2 * total)

            # If only one tiny match exists in a long query,
            # don't trust it.
            if (
                title_hits == 0
                and snippet_hits == 1
                and total >= 3
            ):
                score = min(score, 0.20)

        # -----------------------------------------------------
        # Single-token query
        # -----------------------------------------------------

        if total == 1:

            token = next(iter(query_tokens))

            if token in title_tokens:
                score = max(score, 0.85)

            elif token in snippet_tokens:
                score = max(score, 0.55)

            else:
                score = 0.0

        return round(
            max(0.0, min(score, 1.0)),
            4,
        )

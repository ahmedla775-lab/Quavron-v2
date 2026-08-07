from rag.retriever import retriever
from rag.context import context


class RAGEngine:

    COMPARISON_WORDS = {
        "compare",
        "comparison",
        "versus",
        "vs",
        "difference",
        "differences",
        "قارن",
        "مقارنة",
        "الفرق",
        "ما الفرق",
        "ما هو الفرق",
        "أيهما",
        "أفضل من",
        "مقابل",
    }

    def _is_comparison(self, question):
        q = str(question or "").lower()
        return any(word in q for word in self.COMPARISON_WORDS)

    def _comparison_queries(self, question):
        """
        Build focused retrieval queries for each side of a comparison.
        """

        q = str(question or "").strip()

        separators = [
            " مقابل ",
            " مقابل",
            " vs ",
            " versus ",
            " و ",
            " أم ",
            " and ",
        ]

        parts = [q]

        for separator in separators:
            expanded = []

            for part in parts:
                if separator in part:
                    expanded.extend(
                        x.strip()
                        for x in part.split(separator)
                        if x.strip()
                    )
                else:
                    expanded.append(part)

            parts = expanded

        # Remove obvious question/control words.
        cleaned = []

        ignored = {
            "قارن",
            "مقارنة",
            "ما الفرق",
            "ما هو الفرق",
            "الفرق بين",
            "أيهما أفضل",
            "أيهما",
            "compare",
            "comparison",
            "what is the difference",
            "difference between",
        }

        for part in parts:
            value = part.strip(" ؟?!.,:")

            for word in ignored:
                if value.lower().startswith(word.lower()):
                    value = value[len(word):].strip(" بين:؟?!.,")
                    break

            if value and value not in cleaned:
                cleaned.append(value)

        # For Quavron terminology, make sure the two entities
        # are retrieved explicitly.
        known_terms = [
            "Cloud IDE",
            "Marketplace",
            "Quavron",
        ]

        lower_q = q.lower()

        for term in known_terms:
            if term.lower() in lower_q and term not in cleaned:
                cleaned.append(term)

        return cleaned

    def _merge_documents(self, document_sets):
        """
        Merge documents while removing useless duplicate vector
        fragments such as 'Cloud IDE', 'cloud', 'ide', etc.
        """

        merged = []
        seen = set()

        for docs in document_sets:
            for doc in docs:
                text = str(doc.get("text", "")).strip()

                if not text:
                    continue

                source = doc.get("source", "")

                # Tiny vector fragments are retrieval artifacts,
                # not useful knowledge.
                if source == "vector":
                    normalized = " ".join(text.split()).lower()

                    if len(normalized) < 20:
                        continue

                fingerprint = (
                    source,
                    " ".join(text.lower().split())
                )

                if fingerprint in seen:
                    continue

                seen.add(fingerprint)
                merged.append(doc)

        merged.sort(
            key=lambda x: (
                float(x.get("relevance", 0) or 0),
                float(x.get("final_score", 0) or 0),
            ),
            reverse=True,
        )

        return merged[:8]

    def prepare(self, question):

        if self._is_comparison(question):

            queries = self._comparison_queries(question)

            document_sets = []

            for query in queries:
                try:
                    docs = retriever.retrieve(query, limit=8)
                    document_sets.append(docs)
                except Exception as e:
                    print(
                        "[RAGEngine] Comparison retrieval error:",
                        e
                    )

            documents = self._merge_documents(document_sets)

        else:
            documents = retriever.retrieve(question)

        return {
            "question": question,
            "documents": documents,
            "context": context.build(question, documents),
        }


engine = RAGEngine()

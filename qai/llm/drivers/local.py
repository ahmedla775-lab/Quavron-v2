import re

from llm.drivers.base import BaseDriver


NO_ANSWER = "لا أملك حاليًا معلومات موثوقة كافية للإجابة عن هذا السؤال."


class LocalDriver(BaseDriver):

    def __init__(self):
        super().__init__("local")

    def available(self):
        return True

    # =========================================================
    # Text normalization
    # =========================================================

    def _normalize(self, text):
        if not text:
            return ""

        text = str(text).lower()

        replacements = {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ة": "ه",
            "ى": "ي",
        }

        for a, b in replacements.items():
            text = text.replace(a, b)

        text = re.sub(r"[^\w\s\u0600-\u06ff]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()

        return text

    # =========================================================
    # Parse RAG context
    # =========================================================

    def _parse_documents(self, context):

        if not context:
            return []

        documents = []
        lines = context.splitlines()
        current = None

        for line in lines:

            line = line.strip()

            if not line:
                continue

            match = re.match(
                r"\[source=([^;\]]+)"
                r"(?:;\s*score=([0-9.\-]+))?"
                r"(?:;\s*relevance=([0-9.\-]+))?"
                r"(?:;\s*final(?:_score)?=([0-9.\-]+))?"
                r"\]\s*(.*)",
                line,
                re.IGNORECASE,
            )

            if match:

                if current:
                    documents.append(current)

                source = match.group(1).strip()
                score = float(match.group(2) or 0)
                relevance = float(match.group(3) or 0)
                final_score = float(match.group(4) or 0)
                text = match.group(5).strip()

                current = {
                    "source": source,
                    "score": score,
                    "relevance": relevance,
                    "final_score": final_score,
                    "text": text,
                }

                continue

            if current and not current.get("text"):
                current["text"] = line

        if current:
            documents.append(current)

        # Fallback for simple contexts
        if not documents:

            for line in lines:

                line = line.strip()

                if line and not line.startswith("==="):

                    documents.append({
                        "source": "knowledge",
                        "score": 0,
                        "relevance": 0,
                        "final_score": 0,
                        "text": line,
                    })

        return documents

    # =========================================================
    # Question echo
    # =========================================================

    def _is_question_echo(self, question, text):

        q = self._normalize(question)
        t = self._normalize(text)

        if not q or not t:
            return False

        return q == t

    # =========================================================
    # Language detection
    # =========================================================

    def _is_arabic(self, text):
        return bool(re.search(r"[\u0600-\u06ff]", str(text)))

    def _is_english(self, text):
        return bool(re.search(r"[a-zA-Z]", str(text)))

    # =========================================================
    # Knowledge quality
    # =========================================================

    def _quality(self, doc):

        source = str(doc.get("source", "")).lower()

        relevance = float(
            doc.get("relevance", 0) or 0
        )

        final_score = float(
            doc.get("final_score", 0) or 0
        )

        text = str(
            doc.get("text", "")
        ).strip()

        # Actual knowledge is more valuable than
        # isolated vector labels.
        source_bonus = {
            "knowledge": 1000,
            "qai_learning": 950,
            "learning_dataset": 950,
            "memory": 900,
            "vector": 100,
        }.get(source, 0)

        # Very short vector labels are weak evidence.
        length_bonus = min(len(text), 300)

        return (
            source_bonus
            + relevance * 10
            + final_score
            + length_bonus
        )

    # =========================================================
    # Clean and deduplicate documents
    # =========================================================

    def _clean_documents(self, question, documents):

        cleaned = []
        seen = set()

        for doc in documents:

            text = str(
                doc.get("text", "")
            ).strip()

            if not text:
                continue

            if self._is_question_echo(question, text):
                continue

            normalized = self._normalize(text)

            if normalized in seen:
                continue

            seen.add(normalized)

            item = dict(doc)
            item["_quality"] = self._quality(item)

            cleaned.append(item)

        cleaned.sort(
            key=lambda x: (
                float(x.get("relevance", 0) or 0),
                x.get("_quality", 0),
            ),
            reverse=True,
        )

        return cleaned

    # =========================================================
    # Detect comparison
    # =========================================================

    def _is_comparison(self, question):

        q = self._normalize(question)

        words = [
            "قارن",
            "مقارنه",
            "الفرق",
            "ما الفرق",
            "ماهو الفرق",
            "ايهما",
            "افضل من",
            "مقابل",
            "compare",
            "comparison",
            "difference",
            "differences",
            "versus",
            "vs",
        ]

        return any(
            self._normalize(word) in q
            for word in words
        )

    # =========================================================
    # Detect concepts
    # =========================================================

    def _detect_concepts(self, question, documents):

        q = self._normalize(question)

        concepts = []

        # Known Quavron concepts.
        known = [
            "cloud ide",
            "marketplace",
            "qai",
            "quavron",
            "dashboard",
            "community",
            "hosting",
            "courses",
        ]

        for concept in known:

            normalized = self._normalize(concept)

            if normalized in q:
                concepts.append(concept)

        # Also detect meaningful phrases from documents.
        for doc in documents:

            text = str(doc.get("text", ""))

            for concept in known:

                normalized = self._normalize(concept)

                if normalized in self._normalize(text):
                    if concept not in concepts:
                        concepts.append(concept)

        return concepts

    # =========================================================
    # Find best document for concept
    # =========================================================

    def _best_for_concept(self, concept, documents):

        normalized_concept = self._normalize(concept)

        candidates = []

        for doc in documents:

            text = str(
                doc.get("text", "")
            ).strip()

            if not text:
                continue

            normalized_text = self._normalize(text)

            if normalized_concept not in normalized_text:
                continue

            # Ignore isolated labels such as:
            # "Cloud IDE"
            # "marketplace"
            if len(normalized_text.split()) <= 3:
                continue

            candidates.append(doc)

        if not candidates:
            return None

        # Prefer Arabic when user asks in Arabic.
        candidates.sort(
            key=lambda doc: (
                1 if self._is_arabic(
                    doc.get("text", "")
                ) else 0,
                float(doc.get("relevance", 0) or 0),
                doc.get("_quality", 0),
            ),
            reverse=True,
        )

        return candidates[0]

    # =========================================================
    # Local comparison reasoning
    # =========================================================

    def _build_comparison(self, question, documents):

        concepts = self._detect_concepts(
            question,
            documents,
        )

        # Comparison requires at least two concepts.
        if len(concepts) < 2:
            return None

        selected = []

        for concept in concepts[:4]:

            doc = self._best_for_concept(
                concept,
                documents,
            )

            if doc:
                selected.append(
                    (
                        concept,
                        doc,
                    )
                )

        if len(selected) < 2:
            return None

        lines = [
            "يمكن تلخيص الفرق بينهما كالتالي:",
            "",
        ]

        for concept, doc in selected:

            text = str(
                doc.get("text", "")
            ).strip()

            display_name = {
                "cloud ide": "Cloud IDE",
                "marketplace": "Marketplace",
                "qai": "QAI",
                "quavron": "Quavron",
            }.get(
                concept,
                concept,
            )

            lines.append(
                f"• {display_name}: {text}"
            )

        # Known Quavron semantic distinction.
        normalized_concepts = {
            self._normalize(c)
            for c, _ in selected
        }

        if (
            "cloud ide" in normalized_concepts
            and "marketplace" in normalized_concepts
        ):
            lines.extend([
                "",
                "الفرق الأساسي: Cloud IDE مخصص للتطوير البرمجي وإنشاء واختبار وإدارة المشاريع، بينما Marketplace مخصص لاكتشاف الخدمات والمنتجات والفرص وربط المستخدمين بها.",
            ])

        return "\n".join(lines)

    # =========================================================
    # Select best single knowledge
    # =========================================================

    def _select_best(self, question, documents):

        candidates = []

        for doc in documents:

            text = str(
                doc.get("text", "")
            ).strip()

            if not text:
                continue

            if self._is_question_echo(
                question,
                text,
            ):
                continue

            relevance = float(
                doc.get("relevance", 0) or 0
            )

            if relevance <= 0:
                continue

            candidates.append(
                (
                    self._quality(doc),
                    doc,
                )
            )

        if not candidates:
            return None

        candidates.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        return candidates[0][1]

    # =========================================================
    # Ask
    # =========================================================

    def ask(self, prompt, context=""):

        documents = self._parse_documents(
            context
        )

        print(
            f"[LocalDriver] RAG documents parsed: "
            f"{len(documents)}"
        )

        documents = self._clean_documents(
            prompt,
            documents,
        )

        # -----------------------------------------------------
        # No knowledge
        # -----------------------------------------------------

        if not documents:

            return {
                "provider": "local",
                "status": "completed",
                "source": "local",
                "confidence": 0.0,
                "relevance": 0,
                "answer": NO_ANSWER,
                "message": None,
            }

        # -----------------------------------------------------
        # Comparison reasoning
        # -----------------------------------------------------

        if self._is_comparison(prompt):

            comparison = self._build_comparison(
                prompt,
                documents,
            )

            if comparison:

                return {
                    "provider": "local",
                    "status": "completed",
                    "source": "local_knowledge",
                    "confidence": 0.85,
                    "relevance": 100,
                    "answer": comparison,
                    "message": None,
                }

        # -----------------------------------------------------
        # Normal question
        # -----------------------------------------------------

        best = self._select_best(
            prompt,
            documents,
        )

        if not best:

            return {
                "provider": "local",
                "status": "completed",
                "source": "local",
                "confidence": 0.0,
                "relevance": 0,
                "answer": NO_ANSWER,
                "message": None,
            }

        answer = str(
            best.get("text", "")
        ).strip()

        relevance = float(
            best.get("relevance", 0) or 0
        )

        source = best.get(
            "source",
            "local",
        )

        # -----------------------------------------------------
        # Confidence
        # -----------------------------------------------------

        if relevance >= 90:
            confidence = 0.80

        elif relevance >= 70:
            confidence = 0.70

        elif relevance >= 40:
            confidence = 0.55

        elif relevance > 0:
            confidence = 0.35

        else:
            confidence = 0.20

        if not answer:

            answer = NO_ANSWER
            confidence = 0.0
            source = "local"
            relevance = 0

        return {
            "provider": "local",
            "status": "completed",
            "source": source,
            "confidence": confidence,
            "relevance": relevance,
            "answer": answer,
            "message": None,
        }


driver = LocalDriver()

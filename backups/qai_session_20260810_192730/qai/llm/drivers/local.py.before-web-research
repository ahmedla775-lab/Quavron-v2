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
                r"(?:;\s*approved=(true|false))?"
                r"(?:;\s*confidence=([0-9.\-]+))?"
                r"(?:;\s*teacher=([^;\]]*))?"
                r"(?:;\s*question=([^;\]]*))?"
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

                approved_raw = match.group(5)
                approved = (
                    str(approved_raw).lower() == "true"
                    if approved_raw is not None
                    else False
                )

                confidence = float(match.group(6) or 0)

                teacher = (
                    match.group(7).strip()
                    if match.group(7)
                    else None
                )

                stored_question = (
                    match.group(8).strip()
                    if match.group(8)
                    else ""
                )

                text = match.group(9).strip()

                current = {
                    "source": source,
                    "score": score,
                    "relevance": relevance,
                    "final_score": final_score,
                    "approved": approved,
                    "confidence": confidence,
                    "teacher": teacher,
                    "question": stored_question,
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

    def keywords(self, text):
        stop_words = {
            "ما", "هو", "هي", "هل", "من", "عن",
            "كيف", "ماذا", "لماذا", "اشرح",
            "لي", "اخبرني", "اريد", "ان",
            "what", "is", "the", "how", "why",
            "about", "can", "you",
        }

        normalized = self._normalize(text)

        return [
            word
            for word in normalized.split()
            if word and word not in stop_words
        ]

    def _is_arabic(self, text):
        return bool(re.search(r"[\u0600-\u06ff]", str(text)))

    def _is_english(self, text):
        return bool(re.search(r"[a-zA-Z]", str(text)))

    # =========================================================
    # Question intent analysis
    # =========================================================

    def _split_question_parts(self, question):
        """
        Split a compound question into meaningful independent parts.

        Examples:
        - "ما هي Quavron؟" -> one part
        - "ما هي Quavron وهل هي مجانية؟" -> two parts
        - "ما هي Quavron وما هو QAI وهل هي مجانية؟" -> three parts
        """

        normalized = self._normalize(question)

        if not normalized:
            return []

        # Remove conversational prefixes.
        normalized = re.sub(
            r"^(اشرح لي|اخبرني عن|اخبرني|اريد ان اعرف|اريد معرفة)\s+",
            "",
            normalized,
        ).strip()

        # Split only on real question connectors.
        parts = re.split(
            r"\s+(?:و|وما|وما هو|وما هي|وهل|و هل|وكيف|و كيف|ولماذا|و لماذا)\s+",
            normalized,
        )

        cleaned = []

        for part in parts:
            part = part.strip(" ؟?،,.")

            if not part:
                continue

            # Avoid creating tiny meaningless fragments.
            words = self.keywords(part)

            if len(words) >= 1:
                cleaned.append(part)

        # If splitting produced nothing useful, keep original question.
        if not cleaned:
            return [question.strip()]

        # -----------------------------------------------------
        # Context carry-over for compound questions
        # -----------------------------------------------------
        #
        # Arabic compound questions often omit the subject
        # after the first clause:
        #
        #   "ما هي منصة Quavron وما هو Quavron AI وهل هي مجانية؟"
        #
        # The later "هي" refers to Quavron.
        # Restore the subject so every part can be matched
        # independently against RAG knowledge.
        #
        context_entity = None

        known_entities = [
            "quavron ai",
            "quavron",
            "qai",
            "cloud ide",
            "marketplace",
            "dashboard",
            "community",
            "hosting",
            "courses",
        ]

        normalized_original = self._normalize(
            question
        )

        for entity in known_entities:
            if self._normalize(entity) in normalized_original:
                context_entity = entity
                break

        if context_entity:
            expanded = []

            for index, part in enumerate(cleaned):
                normalized_part = self._normalize(part)

                # Do not duplicate an entity already present.
                has_entity = any(
                    self._normalize(entity) in normalized_part
                    for entity in known_entities
                )

                if not has_entity:

                    # "هو ..." / "هي ..." / "الذي ..."
                    # clauses inherit the previous entity.
                    if (
                        normalized_part.startswith("هو ")
                        or normalized_part.startswith("هي ")
                        or normalized_part.startswith("الذي ")
                        or normalized_part.startswith("التي ")
                        or normalized_part.startswith("الذي يساعد")
                        or normalized_part.startswith("التي تساعد")
                    ):
                        part = (
                            f"{context_entity} "
                            f"{part}"
                        )

                expanded.append(part)

            cleaned = expanded

        return cleaned

    # =========================================================
    # Intent / concept extraction
    # =========================================================

    def _question_concepts(self, question):
        """
        Detect important Quavron concepts and semantic intents
        from one question part.

        Intent boundaries are deliberately strict:
        - learning_test = official/verification test questions
        - learning_process = how the learning cycle works
        - supervisor_learning = whether/how QAI learns from supervisor
        """

        q = self._normalize(question)
        concepts = []

        # ---------------------------------------------------------
        # Known Quavron concepts
        # ---------------------------------------------------------

        known = [
            "quavron ai",
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
            if self._normalize(concept) in q:
                concepts.append(concept)

        # ---------------------------------------------------------
        # Semantic intent markers
        # ---------------------------------------------------------

        intents = {
            "identity": [
                "ما هي",
                "ماهو",
                "ما هو",
                "اشرح",
                "تعريف",
                "منصة",
                "platform",
            ],

            "pricing": [
                "مجاني",
                "مجانية",
                "سعر",
                "اسعار",
                "تكلفة",
                "اشتراك",
                "مدفوع",
                "خطة",
                "plans",
                "price",
                "pricing",
                "free",
            ],

            "capabilities": [
                "ماذا يساعد",
                "ماذا يفعل",
                "ماذا يقدم",
                "ما الذي يساعد",
                "وظائف",
                "امكانيات",
                "يساعد",
                "يقدم",
                "يفعل",
            ],

            # IMPORTANT:
            # Do NOT use "دورة تعلم" alone here.
            # A question saying "كيف تعمل دورة تعلم QAI؟"
            # is about the learning process, not the official test.
            "learning_test": [
                "الاختبار الرسمي",
                "اختبار رسمي",
                "اختبار دورة",
                "اختبار التعلم",
                "اختبار تعلم",
                "اختبار اعتماد",
                "اختبار معتمد",
                "اختبار التحقق",
            ],

            "learning_process": [
                "كيف تعمل دورة",
                "كيف تعمل دوره",
                "كيف يعمل التعلم",
                "كيف تعمل عملية التعلم",
                "طريقة عمل دورة",
                "طريقة عمل التعلم",
                "دورة التعلم",
                "دوره التعلم",
            ],

            "supervisor_learning": [
                "يتعلم من المشرف",
                "التعلم من المشرف",
                "تعلم من المشرف",
                "يمكنه التعلم من المشرف",
                "يمكن لـ qai التعلم",
                "يمكن ل qai التعلم",
                "هل يستطيع qai التعلم",
                "هل يمكن لـ qai التعلم",
                "هل يمكن ل qai التعلم",
                "qai يتعلم من المشرف",
            ],
        }

        # ---------------------------------------------------------
        # Identity
        # ---------------------------------------------------------

        identity_detected = any(
            self._normalize(marker) in q
            for marker in intents["identity"]
        )

        # Identity can also appear as a shortened compound clause.
        if not identity_detected:
            if any(
                self._normalize(entity) in q
                for entity in ["quavron ai", "quavron", "qai"]
            ):
                if (
                    q.startswith("هو ")
                    or q.startswith("هي ")
                    or q.startswith("ما ")
                ):
                    identity_detected = True

        if identity_detected:
            concepts.append("intent:identity")

        # ---------------------------------------------------------
        # Explicit intents
        # ---------------------------------------------------------

        for intent, markers in intents.items():
            if intent == "identity":
                continue

            if any(
                self._normalize(marker) in q
                for marker in markers
            ):
                concepts.append(f"intent:{intent}")

        # ---------------------------------------------------------
        # Intent precedence / conflict cleanup
        # ---------------------------------------------------------

        # "learning_test" is specifically about an official test.
        # It must not be inferred merely because the question contains
        # "دورة تعلم".
        #
        # If the question is explicitly about how the course/learning
        # process works, remove learning_test.
        if (
            "intent:learning_test" in concepts
            and "intent:learning_process" in concepts
        ):
            concepts.remove("intent:learning_test")

        # Questions about learning from the supervisor are a distinct
        # intent and must not inherit the official-test intent.
        if "intent:supervisor_learning" in concepts:
            if "intent:learning_test" in concepts:
                concepts.remove("intent:learning_test")

        return concepts
    # =========================================================
    # Document relevance for a question part
    # =========================================================

    def _document_match_score(self, question, document):
        """
        Strict intent/document matching.

        A document must first belong to the same intent/topic boundary
        before its lexical/relevance score can make it a candidate.

        Critical boundaries:
        - learning-test != learning-process
        - learning-test != supervisor-learning
        - QAI learning course != generic Quavron/platform knowledge
        - platform test != QAI learning-course test
        """

        text = str(
            document.get("text", "")
        ).strip()

        if not text:
            return -1

        relevance = float(
            document.get("relevance", 0) or 0
        )

        if relevance <= 0:
            return -1

        q = self._normalize(question)
        t = self._normalize(text)

        q_words = set(self.keywords(question))
        d_words = set(self.keywords(text))
        overlap = len(q_words & d_words)

        # -----------------------------------------------------
        # Intent-aware matching
        # -----------------------------------------------------

        concepts = self._question_concepts(question)

        # -----------------------------------------------------
        # Strict learning-test boundary
        # -----------------------------------------------------
        #
        # An official learned test is a very specific intent.
        # Generic mentions of "learning", "QAI", or "course" are
        # NOT sufficient.

        if "intent:learning_test" in concepts:

            question_test = any(
                marker in q
                for marker in [
                    "الاختبار الرسمي",
                    "اختبار رسمي",
                    "اختبار دورة",
                    "اختبار التعلم",
                    "اختبار التعلم المعتمد",
                ]
            )

            question_course = any(
                marker in q
                for marker in [
                    "دورة تعلم",
                    "دوره تعلم",
                    "دورة التعلم",
                    "دوره التعلم",
                    "التعلم المعتمد",
                ]
            )

            question_qai = "qai" in q

            # -------------------------------------------------
            # Official QAI learning-course test
            # -------------------------------------------------

            if question_test and question_course and question_qai:

                valid_markers = [
                    "اختبار رسمي",
                    "الاختبار الرسمي",
                    "دورة التعلم",
                    "دورة تعلم",
                    "التعلم المعتمد",
                    "المعلم",
                    "قاعدة المعرفة",
                    "rag",
                ]

                has_learning_test_evidence = any(
                    marker in t
                    for marker in valid_markers
                )

                # A generic QAI/Quavron answer must never answer
                # the official learning-test question.
                if not has_learning_test_evidence:
                    return -1

                # Strong bonus for direct test evidence.
                score = relevance * 10
                score += overlap * 12
                score += 260

                if "اختبار رسمي" in t or "الاختبار الرسمي" in t:
                    score += 120

                if "قاعدة المعرفة" in t:
                    score += 80

                if "rag" in t:
                    score += 80

                if "المعلم" in t:
                    score += 60

                return score

            # -------------------------------------------------
            # Any other learning-test question
            # -------------------------------------------------

            if not any(
                marker in t
                for marker in [
                    "اختبار",
                    "دورة",
                    "التعلم",
                ]
            ):
                return -1

        # -----------------------------------------------------
        # Supervisor-learning boundary
        # -----------------------------------------------------
        #
        # "هل يستطيع QAI التعلم من المشرف؟" must not inherit
        # an answer that was approved for the official test.

        supervisor_learning_markers = [
            "يتعلم من المشرف",
            "التعلم من المشرف",
            "تعلم من المشرف",
            "يمكن لـ qai التعلم",
            "يمكن ل qai التعلم",
            "qai يتعلم",
            "qai تعلم",
        ]

        question_is_supervisor_learning = any(
            marker in q
            for marker in supervisor_learning_markers
        )

        document_is_official_test = any(
            marker in t
            for marker in [
                "الاختبار الرسمي",
                "اختبار رسمي",
                "اختبار دورة",
                "اختبار التعلم",
            ]
        )

        if question_is_supervisor_learning and document_is_official_test:
            return -1

        # -----------------------------------------------------
        # Learning process boundary
        # -----------------------------------------------------
        #
        # "كيف تعمل دورة تعلم QAI؟" is not the official test.

        process_markers = [
            "كيف تعمل",
            "كيف يعمل",
            "كيف تتم",
            "كيف يتم",
            "طريقة عمل",
            "اشرح كيف",
        ]

        question_is_learning_process = (
            "qai" in q
            and any(
                marker in q
                for marker in process_markers
            )
            and any(
                marker in q
                for marker in [
                    "دورة تعلم",
                    "دورة التعلم",
                    "التعلم",
                ]
            )
        )

        if question_is_learning_process and document_is_official_test:
            return -1

        # -----------------------------------------------------
        # Platform-test boundary
        # -----------------------------------------------------
        #
        # "ما هو الاختبار الرسمي لمنصة Quavron؟" is NOT the
        # approved QAI learning-course test.

        question_is_platform_test = (
            "quavron" in q
            and any(
                marker in q
                for marker in [
                    "اختبار",
                    "الاختبار",
                ]
            )
            and any(
                marker in q
                for marker in [
                    "منصة",
                    "منصه",
                ]
            )
        )

        if question_is_platform_test and document_is_official_test:
            # The approved learning test belongs to the QAI course,
            # not to the Quavron platform.
            if (
                "دورة تعلم" in t
                or "دورة التعلم" in t
                or "التعلم المعتمد" in t
                or "qai" in t
            ):
                return -1

        # -----------------------------------------------------
        # Base RAG relevance
        # -----------------------------------------------------

        score = relevance * 10

        # Lexical evidence.
        score += overlap * 12

        # -----------------------------------------------------
        # Identity / definition
        # -----------------------------------------------------

        if "intent:identity" in concepts:

            identity_markers = [
                "منصه",
                "منصه رقميه",
                "منصه الجيل القادم",
                "منصه رقميه من الجيل القادم",
                "مساعد ذكي",
                "مساعد الذكاء الاصطناعي",
            ]

            if any(
                self._normalize(marker) in t
                for marker in identity_markers
            ):
                score += 120

            definition_markers = [
                "هي منصه",
                "هي منصة",
                "منصه رقميه",
                "منصة رقمية",
                "منصه الجيل القادم",
                "منصة الجيل القادم",
                "هو المساعد الذكي",
                "هي المساعده الذكيه",
                "هو المساعد الذكي الرسمي",
            ]

            has_definition = any(
                self._normalize(marker) in t
                for marker in definition_markers
            )

            if has_definition:
                score += 180
            else:
                generic_markers = [
                    "ابدأ بإنشاء حساب",
                    "استكشاف لوحة التحكم",
                    "تجربة qai",
                    "marketplace هو السوق",
                    "مصممة للمبتدئين",
                    "تتكيف مع مستوى المستخدم",
                ]

                if any(
                    self._normalize(marker) in t
                    for marker in generic_markers
                ):
                    score -= 220

        # -----------------------------------------------------
        # Pricing
        # -----------------------------------------------------

        if "intent:pricing" in concepts:

            pricing_markers = [
                "مجاني",
                "مجانيه",
                "خطة مجانيه",
                "خطط مدفوعه",
                "خطط مدفوعة",
                "اشتراك",
                "سعر",
                "تكلفه",
                "تكلفة",
            ]

            if any(
                self._normalize(marker) in t
                for marker in pricing_markers
            ):
                score += 180

        # -----------------------------------------------------
        # Capabilities
        # -----------------------------------------------------

        if "intent:capabilities" in concepts:

            capability_markers = [
                "يساعد",
                "مساعد ذكي",
                "التعلم",
                "العمل",
                "إنشاء المشاريع",
                "انشاء المشاريع",
                "حل المشاكل",
                "حل المشكلات",
                "تطوير الأفكار",
                "تطوير الافكار",
            ]

            if any(
                self._normalize(marker) in t
                for marker in capability_markers
            ):
                score += 180

        # -----------------------------------------------------
        # Learning-test positive evidence
        # -----------------------------------------------------

        if "intent:learning_test" in concepts:

            learning_markers = [
                "اختبار رسمي",
                "دورة التعلم",
                "دورة تعلم",
                "التعلم المعتمد",
                "المعلم",
                "قاعدة المعرفة",
                "rag",
            ]

            if any(
                self._normalize(marker) in t
                for marker in learning_markers
            ):
                score += 220

        # -----------------------------------------------------
        # Concept-aware matching
        # -----------------------------------------------------

        for concept in concepts:

            if concept.startswith("intent:"):
                continue

            normalized_concept = self._normalize(concept)

            if normalized_concept in t:
                score += 100

        # -----------------------------------------------------
        # Avoid generic documents for specific intents
        # -----------------------------------------------------

        if (
            "intent:pricing" in concepts
            and "مجاني" not in t
            and "مجانيه" not in t
            and "مدفوع" not in t
            and "اشتراك" not in t
            and "سعر" not in t
            and "تكلف" not in t
        ):
            score -= 120

        if (
            "intent:capabilities" in concepts
            and not any(
                marker in t
                for marker in [
                    "يساعد",
                    "مساعد",
                    "التعلم",
                    "العمل",
                    "مشاريع",
                    "مشكلات",
                    "مشاكل",
                ]
            )
        ):
            score -= 100

        # Learning-test documents must contain actual test/course
        # evidence. Generic QAI knowledge is not enough.
        if (
            "intent:learning_test" in concepts
            and not any(
                marker in t
                for marker in [
                    "اختبار",
                    "دورة",
                    "التعلم",
                    "المعلم",
                    "قاعدة المعرفة",
                    "rag",
                ]
            )
        ):
            return -1

        # Concise direct answers are preferable.
        if len(text) <= 300:
            score += 5

        return score

    # =========================================================
    # Hard intent boundary
    # =========================================================
    def _document_allowed_for_intent(self, question, document):
        """
        Hard semantic boundary for sensitive/specific intents.

        A document must actually belong to the requested intent.
        Relevance or lexical similarity must never override this
        boundary.
        """
        text = str(document.get("text", "") or "").strip()

        if not text:
            return False

        q = self._normalize(question)
        t = self._normalize(text)
        concepts = self._question_concepts(question)

        # ---------------------------------------------------------
        # Official-test intent
        # ---------------------------------------------------------
        if "intent:learning_test" in concepts:

            is_platform_test = (
                "quavron" in q
                and any(marker in q for marker in [
                    "اختبار",
                    "الاختبار",
                ])
                and any(marker in q for marker in [
                    "منصة",
                    "منصه",
                ])
            )

            is_qai_learning_test = (
                "qai" in q
                and any(marker in q for marker in [
                    "اختبار",
                    "الاختبار",
                ])
                and any(marker in q for marker in [
                    "دورة تعلم",
                    "دوره تعلم",
                    "دورة التعلم",
                    "دوره التعلم",
                    "التعلم المعتمد",
                ])
            )

            document_is_learning_test = any(
                marker in t
                for marker in [
                    "الاختبار الرسمي",
                    "اختبار رسمي",
                    "اختبار دورة",
                    "اختبار التعلم",
                    "اختبار اعتماد",
                    "اختبار معتمد",
                    "اختبار التحقق",
                ]
            )

            document_is_qai_learning_test = (
                document_is_learning_test
                and any(
                    marker in t
                    for marker in [
                        "دورة تعلم",
                        "دورة التعلم",
                        "التعلم المعتمد",
                        "المعلم",
                        "قاعدة المعرفة",
                        "rag",
                    ]
                )
            )

            # Platform test and QAI learning-course test are
            # different knowledge domains.
            if is_platform_test:
                return (
                    document_is_learning_test
                    and not document_is_qai_learning_test
                )

            if is_qai_learning_test:
                return document_is_qai_learning_test

            return document_is_learning_test

        # ---------------------------------------------------------
        # Learning-process intent
        # ---------------------------------------------------------
        if "intent:learning_process" in concepts:

            # The official approval/test answer is not a process answer.
            document_is_official_test = any(
                marker in t
                for marker in [
                    "الاختبار الرسمي",
                    "اختبار رسمي",
                    "اختبار دورة",
                    "اختبار التعلم",
                    "اختبار اعتماد",
                    "اختبار معتمد",
                ]
            )

            if document_is_official_test:
                return False

            # A process document must explicitly discuss the
            # QAI learning/course process.
            process_evidence = any(
                marker in t
                for marker in [
                    "دورة تعلم",
                    "دورة التعلم",
                    "عملية التعلم",
                    "طريقة التعلم",
                    "التعلم من المشرف",
                    "المعلم",
                    "قاعدة المعرفة",
                    "rag",
                ]
            )

            if not process_evidence:
                return False

        # ---------------------------------------------------------
        # Supervisor-learning intent
        # ---------------------------------------------------------
        if "intent:supervisor_learning" in concepts:

            # Never inherit the official-test knowledge.
            document_is_official_test = any(
                marker in t
                for marker in [
                    "الاختبار الرسمي",
                    "اختبار رسمي",
                    "اختبار دورة",
                    "اختبار التعلم",
                    "اختبار اعتماد",
                    "اختبار معتمد",
                ]
            )

            if document_is_official_test:
                return False

            # Generic QAI capabilities are not evidence that QAI
            # can learn from the supervisor.
            supervisor_evidence = any(
                marker in t
                for marker in [
                    "التعلم من المشرف",
                    "تعلم من المشرف",
                    "يتعلم من المشرف",
                    "يمكن لـ qai التعلم",
                    "يمكن ل qai التعلم",
                    "qai يتعلم من المشرف",
                    "qai تعلم من المشرف",
                ]
            )

            if not supervisor_evidence:
                return False

        return True

    def _select_documents_for_question(
        self,
        question,
        documents,
    ):
        """
        Select only documents that actually answer the question.

        Compound questions are handled independently:
        each part gets its own best matching knowledge.
        """

        parts = self._split_question_parts(
            question
        )

        if not parts:
            return []

        selected = []
        seen = set()

        for part in parts:

            candidates = []

            for doc in documents:

                text = str(
                    doc.get("text", "")
                ).strip()

                if not text:
                    continue

                if not self._document_allowed_for_intent(
                    part,
                    doc,
                ):
                    continue

                fingerprint = self._normalize(
                    text
                )

                if fingerprint in seen:
                    continue

                score = self._document_match_score(
                    part,
                    doc,
                )

                if score <= 0:
                    continue

                candidates.append(
                    (
                        score,
                        doc,
                    )
                )

            if not candidates:
                continue

            candidates.sort(
                key=lambda item: item[0],
                reverse=True,
            )

            best_score, best_doc = candidates[0]

            selected.append(
                (
                    part,
                    best_score,
                    best_doc,
                )
            )

            seen.add(
                self._normalize(
                    str(
                        best_doc.get("text", "")
                    )
                )
            )

        return selected

    # =========================================================
    # Semantic answer overlap
    # =========================================================

    def _answer_overlap(self, first, second):
        """
        Detect semantic overlap between two candidate answers.

        Uses meaningful-word overlap as the base signal, while
        ignoring generic Arabic filler words. This prevents two
        differently-worded RAG answers about the same concept from
        being repeated.
        """
        first_words = set(self.keywords(first))
        second_words = set(self.keywords(second))

        if not first_words or not second_words:
            return 0.0

        common = first_words & second_words

        # Coverage from both directions.
        first_coverage = len(common) / max(len(first_words), 1)
        second_coverage = len(common) / max(len(second_words), 1)

        # Symmetric overlap is safer than dividing only by the
        # smaller answer.
        return (
            first_coverage + second_coverage
        ) / 2.0

    # =========================================================
    # Merge related answers
    # =========================================================

    def _merge_related_answers(self, first, second):
        """
        Deterministically merge two related RAG answers.

        When two answers describe the same entity, remove repeated
        introductions and preserve genuinely new capabilities/facts
        from both answers.
        """
        first = str(first or "").strip()
        second = str(second or "").strip()

        if not first:
            return second

        if not second:
            return first

        first_words = set(self.keywords(first))
        second_words = set(self.keywords(second))

        if not first_words or not second_words:
            return first

        common = first_words & second_words

        first_coverage = len(common) / max(len(first_words), 1)
        second_coverage = len(common) / max(len(second_words), 1)

        overlap = (first_coverage + second_coverage) / 2.0

        if overlap < 0.35:
            return None

        # ---------------------------------------------------------
        # Special deterministic synthesis for the same Quavron AI
        # ---------------------------------------------------------
        same_quavron_ai = (
            "quavron" in first_words
            and "ai" in first_words
            and "quavron" in second_words
            and "ai" in second_words
        )

        if same_quavron_ai:
            # Collect meaningful capability phrases from both answers.
            capabilities = []

            capability_patterns = [
                "التعلم",
                "العمل",
                "إنشاء المشاريع",
                "تطوير الأفكار",
                "حل المشاكل",
            ]

            combined = first + " " + second

            for capability in capability_patterns:
                if capability in combined:
                    capabilities.append(capability)

            # Remove duplicates while preserving the intended order.
            unique_capabilities = []
            for capability in capabilities:
                if capability not in unique_capabilities:
                    unique_capabilities.append(capability)

            if unique_capabilities:
                if len(unique_capabilities) == 1:
                    capability_text = unique_capabilities[0]
                elif len(unique_capabilities) == 2:
                    capability_text = (
                        unique_capabilities[0]
                        + " و"
                        + unique_capabilities[1]
                    )
                else:
                    capability_text = (
                        " و".join(unique_capabilities[:-1])
                        + " و"
                        + unique_capabilities[-1]
                    )

                return (
                    "Quavron AI هو المساعد الذكي الرسمي للمنصة، "
                    "يساعد المستخدمين على "
                    + capability_text
                    + "."
                )

        # ---------------------------------------------------------
        # Generic deterministic merge
        # ---------------------------------------------------------
        def clauses(text):
            items = re.split(
                r"[.!؟?؛;]+|،\s+(?=يساعد|يقدم|يمكن|ويساعد|ويمكن)",
                text,
            )

            result = []

            for item in items:
                item = item.strip(" ،,؛;.")
                if item:
                    result.append(item)

            return result

        first_clauses = clauses(first)
        second_clauses = clauses(second)

        merged = []

        for clause in first_clauses + second_clauses:
            normalized = self._normalize(clause)

            if not normalized:
                continue

            duplicate = False

            for existing in merged:
                existing_normalized = self._normalize(existing)

                if (
                    normalized == existing_normalized
                    or normalized in existing_normalized
                    or existing_normalized in normalized
                    or self._answer_overlap(
                        clause,
                        existing,
                    ) >= 0.70
                ):
                    duplicate = True
                    break

            if not duplicate:
                merged.append(clause)

        if not merged:
            return first

        result = merged[0]

        for clause in merged[1:]:
            if self._normalize(clause) == self._normalize(result):
                continue

            result += "، " + clause

        return result + "."

    # =========================================================
    # Compose intent-aware answer
    # =========================================================

    def _compose_intent_answer(
        self,
        question,
        documents,
    ):
        """
        Answer simple and compound questions without
        blindly concatenating all RAG documents.
        """

        selected = self._select_documents_for_question(
            question,
            documents,
        )

        if not selected:
            return None

        parts = []

        for part, score, doc in selected:

            text = str(
                doc.get("text", "")
            ).strip()

            if not text:
                continue

            # Avoid duplicate semantic answers.
            normalized = self._normalize(text)

            duplicate = False

            for existing in parts:
                existing_normalized = self._normalize(
                    existing
                )

                if (
                    normalized == existing_normalized
                    or normalized in existing_normalized
                    or existing_normalized in normalized
                    or self._answer_overlap(
                        text,
                        existing,
                    ) >= 0.65
                ):
                    duplicate = True
                    break

            if duplicate:
                continue

            parts.append(text)

        if not parts:
            return None

        # -----------------------------------------------------
        # Semantic compression for closely related answers
        # -----------------------------------------------------
        #
        # RAG may return two documents that answer the same
        # concept with slightly different wording. Instead of
        # blindly concatenating them, keep the most informative
        # version and merge only genuinely complementary text.
        #
        # Example:
        #   "QAI يساعد على التعلم وإنشاء المشاريع وحل المشاكل."
        #   "QAI يساعد على التعلم والعمل وتطوير الأفكار والمشاريع."
        #
        # These should become one coherent answer.
        compressed = []

        for text in parts:
            normalized = self._normalize(text)

            if not compressed:
                compressed.append(text)
                continue

            merged = False

            for index, existing in enumerate(compressed):
                existing_normalized = self._normalize(existing)

                overlap = self._answer_overlap(
                    text,
                    existing,
                )

                # Answers with strong conceptual overlap should be
                # merged rather than simply choosing one of them.
                if overlap >= 0.40:
                    merged_answer = self._merge_related_answers(
                        existing,
                        text,
                    )

                    if merged_answer:
                        compressed[index] = merged_answer
                        merged = True
                        break

                # One answer substantially contains the other.
                if (
                    normalized in existing_normalized
                    or existing_normalized in normalized
                ):
                    if len(text) > len(existing):
                        compressed[index] = text

                    merged = True
                    break

            if not merged:
                compressed.append(text)

        # Final duplicate protection.
        final_parts = []
        seen = set()

        for text in compressed:
            normalized = self._normalize(text)

            if not normalized or normalized in seen:
                continue

            seen.add(normalized)
            final_parts.append(text)

        return " ".join(final_parts)

    # =========================================================
    # Intent answer quality
    # =========================================================

    def _intent_answer_quality(self, question, documents):
        """
        Measure how completely the selected RAG knowledge answers
        the independent parts of the question.

        Quality combines:
        - retrieval relevance
        - local semantic/document match
        - compound-question coverage

        Retrieval relevance must remain important, but a correct
        local knowledge match should not be destroyed by a modest
        raw RAG relevance value.
        """
        parts = self._split_question_parts(question)

        if not parts:
            return 0.0, 0.0, 0, 0

        selected = self._select_documents_for_question(
            question,
            documents,
        )

        if not selected:
            return 0.0, 0.0, 0, len(parts)

        answered = len(selected)
        total = len(parts)

        coverage = answered / max(total, 1)

        scores = []
        relevances = []

        for part, score, doc in selected:
            if score is not None:
                scores.append(float(score))

            relevance = float(
                doc.get("relevance", 0) or 0
            )
            relevances.append(relevance)

        avg_raw_relevance = (
            sum(relevances) / len(relevances)
            if relevances
            else 0.0
        )

        # Effective relevance reflects the quality of the document
        # actually selected for the question, not only the raw RAG
        # retrieval label.
        #
        # score is produced by _document_match_score() and includes:
        # - raw RAG relevance
        # - lexical overlap
        # - intent matching
        # - definition/capability/pricing/learning-test evidence
        #
        # Keep raw relevance visible as a separate signal, but use the
        # effective value for answer-quality calibration.
        if scores:
            avg_score = sum(scores) / len(scores)

            match_relevance = min(
                max(avg_score, 0.0) / 600.0 * 100.0,
                100.0,
            )

            effective_relevance = (
                avg_raw_relevance * 0.35
                + match_relevance * 0.65
            )
        else:
            effective_relevance = avg_raw_relevance

        relevance_quality = min(
            max(effective_relevance, 0.0) / 100.0,
            1.0,
        )

        # Local semantic/document matching.
        if scores:
            avg_score = sum(scores) / len(scores)

            match_quality = min(
                max(avg_score, 0.0) / 900.0,
                1.0,
            )
        else:
            match_quality = 0.0

        # Compound questions need stronger coverage.
        coverage_quality = coverage

        # Balanced quality model.
        quality = (
            relevance_quality * 0.35
            + match_quality * 0.45
            + coverage_quality * 0.20
        )

        # A single weak document must never produce very high confidence.
        if effective_relevance < 20:
            quality = min(quality, 0.70)
        elif effective_relevance < 30:
            quality = min(quality, 0.85)

        # If every independent part has been answered,
        # allow strong local matching to raise confidence.
        if coverage >= 1.0 and match_quality >= 0.75:
            quality = max(
                quality,
                0.82 if total == 1 else 0.80,
            )

        return (
            min(quality, 1.0),
            effective_relevance,
            answered,
            total,
        )

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
    # Learning knowledge isolation
    # =========================================================

    def _learning_question_match(self, question, document):
        """
        Strict boundary for supervisor-approved learned knowledge.

        Approval means the learned answer is trusted ONLY for the
        question it was approved for, or a genuinely equivalent
        formulation.

        Important:
        - "ما هو الاختبار الرسمي لدورة تعلم QAI؟"
          must match equivalent formulations.
        - "كيف تعمل دورة تعلم QAI؟"
          is a different intent and must NOT inherit the approved answer.
        - "ما هو الاختبار الرسمي لمنصة Quavron؟"
          is a different subject and must NOT inherit it.
        """
        source = str(
            document.get("source", "")
        ).lower()

        if source != "qai_learning":
            return True

        stored_question = document.get("question", "")

        if isinstance(stored_question, dict):
            stored_question = " ".join(
                str(value)
                for value in stored_question.values()
                if value
            )

        current = self._normalize(question)
        stored = self._normalize(stored_question)

        if not current or not stored:
            return False

        # Exact match is always valid.
        if current == stored:
            return True

        # ---------------------------------------------------------
        # Subject/entity boundary
        # ---------------------------------------------------------
        # A learned answer about "QAI learning course test" must not
        # be reused for a generic Quavron/platform question.
        subject_groups = [
            ["qai", "دورة تعلم", "دوره تعلم", "التعلم المعتمد"],
            ["quavron", "منصة", "منصه"],
        ]

        def group_hits(text, group):
            return any(
                self._normalize(marker) in text
                for marker in group
            )

        current_groups = {
            i for i, group in enumerate(subject_groups)
            if group_hits(current, group)
        }

        stored_groups = {
            i for i, group in enumerate(subject_groups)
            if group_hits(stored, group)
        }

        if stored_groups and not (current_groups & stored_groups):
            return False

        # ---------------------------------------------------------
        # Intent boundary
        # ---------------------------------------------------------
        # Official-test questions are NOT equivalent to:
        # - how the learning system works
        # - whether QAI can learn from the supervisor
        # - generic explanations of QAI
        official_test_markers = [
            "الاختبار الرسمي",
            "اختبار رسمي",
            "اختبار دورة",
            "اختبار التعلم",
        ]

        how_it_works_markers = [
            "كيف تعمل",
            "كيف يعمل",
            "كيف تتم",
            "كيف يتم",
            "طريقة عمل",
            "اشرح كيف",
        ]

        learning_from_supervisor_markers = [
            "يتعلم من المشرف",
            "التعلم من المشرف",
            "يمكن لـ qai التعلم",
            "يمكن ل qai التعلم",
            "تعلم من المشرف",
        ]

        stored_is_official_test = any(
            self._normalize(marker) in stored
            for marker in official_test_markers
        )

        current_is_how_it_works = any(
            self._normalize(marker) in current
            for marker in how_it_works_markers
        )

        current_is_supervisor_learning = any(
            self._normalize(marker) in current
            for marker in learning_from_supervisor_markers
        )

        if stored_is_official_test and (
            current_is_how_it_works
            or current_is_supervisor_learning
        ):
            return False

        # If the approved knowledge is specifically an official test,
        # require an explicit test-related signal in the new question.
        if stored_is_official_test:
            if not any(
                self._normalize(marker) in current
                for marker in official_test_markers
            ):
                return False

        # ---------------------------------------------------------
        # Lexical equivalence
        # ---------------------------------------------------------
        q_words = set(self.keywords(question))
        d_words = set(self.keywords(stored_question))

        if not q_words or not d_words:
            return False

        overlap = q_words & d_words

        # Two shared words alone are too weak for approved knowledge.
        # Require stronger overlap for inherited/semantic matches.
        coverage_current = len(overlap) / max(len(q_words), 1)
        coverage_stored = len(overlap) / max(len(d_words), 1)

        return (
            len(overlap) >= 3
            and (
                coverage_current >= 0.35
                or coverage_stored >= 0.50
            )
        )

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

            source = str(
                doc.get("source", "")
            ).lower()

            relevance = float(
                doc.get("relevance", 0) or 0
            )

            # Supervisor-approved learned knowledge:
            # trust it only when it matches the learned question
            # and carries full supervisor approval.
            if source == "qai_learning":
                if not self._learning_question_match(
                    question,
                    doc,
                ):
                    continue

                if (
                    doc.get("approved", False) is not True
                    or float(doc.get("confidence", 0) or 0) < 1.0
                ):
                    continue

            else:
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

    def _is_compound_question(self, question):
        """
        Detect whether the user explicitly asks for multiple independent facts.
        A simple question must not trigger multi-document composition.
        """
        q = self._normalize(question)

        # Explicit connectors that usually indicate multiple questions/facts.
        compound_markers = [
            " وما ",
            " وهل ",
            " وماذا ",
            " وكيف ",
            " ولماذا ",
            " وايضا ",
            " كذلك ",
            " و هل ",
            " and ",
            " also ",
            " what ",
            " how ",
            " why ",
        ]

        # Multiple question marks are a strong compound signal.
        if q.count("?") + q.count("؟") >= 2:
            return True

        return any(
            marker.strip() in q
            for marker in compound_markers
        )

    def _document_matches_question(self, question, doc):
        """
        Check whether a document has meaningful lexical overlap with the
        question. This is intentionally stricter than relevance > 0.
        """
        text = str(doc.get("text", "")).strip()

        if not text:
            return False

        relevance = float(
            doc.get("relevance", 0) or 0
        )

        # Strong RAG relevance is sufficient.
        if relevance >= 40:
            return True

        # Supervisor-approved knowledge is allowed only when the learned
        # question itself matches the current question.
        source = str(
            doc.get("source", "")
        ).lower()

        if source == "qai_learning":
            return (
                doc.get("approved", False) is True
                and float(doc.get("confidence", 0) or 0) >= 1.0
                and self._learning_question_match(
                    question,
                    doc,
                )
            )

        # Moderate relevance requires meaningful keyword overlap.
        q_words = set(self.keywords(question))
        t_words = set(self.keywords(text))

        if not q_words or not t_words:
            return False

        overlap = q_words & t_words

        return len(overlap) >= 1 and relevance >= 20

    def _compose_multi_document_answer(self, question, documents):
        """
        Compose only the knowledge that is actually relevant.

        Simple question:
            -> one best document.

        Compound question:
            -> several complementary documents, deduplicated.

        Never dump the whole RAG result into the answer.
        """
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

            if not self._document_matches_question(
                question,
                doc,
            ):
                continue

            relevance = float(
                doc.get("relevance", 0) or 0
            )

            quality = self._quality(doc)

            candidates.append(
                (
                    relevance,
                    quality,
                    doc,
                )
            )

        if not candidates:
            return None

        # Highest relevance first.
        candidates.sort(
            key=lambda item: (
                item[0],
                item[1],
            ),
            reverse=True,
        )

        # ---------------------------------------------------------
        # SIMPLE QUESTION
        # ---------------------------------------------------------
        if not self._is_compound_question(question):
            return candidates[0][2].get(
                "text",
                "",
            ).strip()

        # ---------------------------------------------------------
        # COMPOUND QUESTION
        # ---------------------------------------------------------
        selected = []
        seen = set()

        for relevance, quality, doc in candidates:
            text = str(
                doc.get("text", "")
            ).strip()

            fingerprint = self._normalize(text)

            if fingerprint in seen:
                continue

            seen.add(fingerprint)
            selected.append(doc)

            # Do not let a compound answer grow indefinitely.
            if len(selected) >= 4:
                break

        if not selected:
            return None

        parts = []

        for doc in selected:
            value = str(
                doc.get("text", "")
            ).strip()

            if not value:
                continue

            if value in parts:
                continue

            parts.append(value)

        if not parts:
            return None

        return " ".join(parts)

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
        # Multi-document reasoning
        # -----------------------------------------------------

        # First determine which documents are actually allowed
        # for this question's intent.
        #
        # IMPORTANT:
        # If the hard intent boundary rejects every document,
        # NO legacy composer is allowed to resurrect a rejected
        # document.
        selected_for_intent = self._select_documents_for_question(
            prompt,
            documents,
        )

        answer = self._compose_intent_answer(
            prompt,
            documents,
        )

        # Fallback to the legacy composer ONLY when the intent-aware
        # selector has already found at least one valid document.
        #
        # This prevents the legacy path from bypassing:
        # - learning-test boundaries
        # - learning-process boundaries
        # - supervisor-learning boundaries
        # - platform-test boundaries
        if not answer and selected_for_intent:
            legacy_answer = self._compose_multi_document_answer(
                prompt,
                documents,
            )

            if legacy_answer:
                legacy_documents = []

                for doc in documents:
                    if self._document_matches_question(
                        prompt,
                        doc,
                    ):
                        # The document must also belong to the
                        # hard-intent-selected set.
                        if any(
                            selected_doc is doc
                            for _, _, selected_doc in selected_for_intent
                        ):
                            legacy_documents.append(doc)

                if legacy_documents:
                    answer = legacy_answer

        if answer:
            quality, avg_relevance, answered_parts, total_parts = (
                self._intent_answer_quality(
                    prompt,
                    documents,
                )
            )

            # Report relevance as the effective relevance of the
            # knowledge actually selected for the question.
            relevance = round(
                avg_relevance,
                2,
            )

            # Approval alone must NEVER make an unrelated answer
            # 100% confident. Approval is trusted only when the learned
            # question actually matches the current question.
            approved_match = any(
                doc.get("source") == "qai_learning"
                and doc.get("approved", False) is True
                and float(
                    doc.get("confidence", 0) or 0
                ) >= 1.0
                and self._learning_question_match(
                    prompt,
                    doc,
                )
                for doc in documents
            )

            if approved_match and answered_parts == total_parts:
                confidence = 1.0
            elif answered_parts == total_parts and quality >= 0.82:
                confidence = 0.95
            elif answered_parts == total_parts and quality >= 0.68:
                confidence = 0.90
            elif answered_parts == total_parts and quality >= 0.52:
                confidence = 0.80
            elif answered_parts > 0 and quality >= 0.45:
                confidence = 0.65
            elif answered_parts > 0:
                confidence = 0.45
            else:
                confidence = 0.0

            # Hard calibration against weak retrieval.
            # High confidence requires genuinely strong RAG evidence.
            if not approved_match:
                if relevance < 40:
                    confidence = min(confidence, 0.80)

                if relevance < 25:
                    confidence = min(confidence, 0.70)

                if relevance < 15:
                    confidence = min(confidence, 0.55)

            return {
                "provider": "local",
                "status": "completed",
                "source": (
                    "local_knowledge"
                    if len(documents) > 1
                    else documents[0].get("source", "local")
                ),
                "confidence": confidence,
                "relevance": relevance,
                "answer": answer,
                "message": None,
            }

        # -----------------------------------------------------
        # No usable answer
        # -----------------------------------------------------

        return {
            "provider": "local",
            "status": "completed",
            "source": "local",
            "confidence": 0.0,
            "relevance": 0,
            "answer": NO_ANSWER,
            "message": None,
        }

# =========================================================
# Module-level driver instance
# =========================================================

driver = LocalDriver()

from vector_memory.search import search
from knowledge.search.search import search_engine
from learning.datasets.retriever import learning_retriever


SOURCE_PRIORITY = {
    "qai_learning": 300,
    "knowledge": 200,
    "web": 250,
    "vector": 100,
}


class Retriever:

    # =========================================================
    # NORMALIZATION
    # =========================================================

    def normalize(self, text):
        text = str(text or "").lower()

        replacements = {
            "أ": "ا",
            "إ": "ا",
            "آ": "ا",
            "ى": "ي",
            "ة": "ه",
        }

        for a, b in replacements.items():
            text = text.replace(a, b)

        # Remove Arabic and English punctuation so that:
        # عصبيه؟ == عصبيه
        # فلسطين؟ == فلسطين
        # الذكاء الاصطناعي! == الذكاء الاصطناعي
        punctuation = "؟،؛：:,.!?؛()[]{}«»“”‘’ـ-_" + "/" + chr(92)
        for mark in punctuation:
            text = text.replace(mark, " ")

        # Arabic definite-article normalization.
        # الشبكة -> شبكة
        # العصبية -> عصبيه
        # الذكاء -> ذكاء
        words = []

        for word in text.split():
            if len(word) > 3 and word.startswith("ال"):
                word = word[2:]
            words.append(word)

        return " ".join(words)

    # =========================================================
    # TOKENIZATION
    # =========================================================

    def meaningful_words(self, text):
        text = self.normalize(text)

        stop_words = {
            "ما", "هو", "هي", "هل", "من",
            "كيف", "ماذا", "لماذا", "متى",
            "اين", "أين", "في", "من",
            "على", "الى", "إلى", "عن",
            "مع", "و", "او", "أو",
            "لي", "ني", "انا", "أنا",
            "يمكن", "يستطيع",

            "the", "what", "is", "how",
            "why", "who", "when", "where",
            "can", "does", "do", "a", "an",

            "فيه", "به", "هذه", "هذا",
            "ذلك", "تلك", "بين",
        }

        return [
            word
            for word in text.split()
            if word not in stop_words
            and len(word) >= 2
        ]

    # =========================================================
    # RELEVANCE
    # =========================================================

    def relevance(self, query, text):
        """
        General lexical/topic relevance.

        This layer is intentionally conservative.
        Domain words such as Quavron, QAI, platform, learning, and test
        are not sufficient by themselves to establish relevance.
        """

        q = self.normalize(query)
        t = self.normalize(text)

        if not q or not t:
            return 0

        q_words = self.meaningful_words(q)
        t_words = self.meaningful_words(t)

        if not q_words or not t_words:
            return 0

        qset = set(q_words)
        tset = set(t_words)

        # ---------------------------------------------------------
        # Exact full text
        # ---------------------------------------------------------

        if q == t:
            return 100

        # ---------------------------------------------------------
        # Topic groups
        # ---------------------------------------------------------

        topic_groups = {
            "platform": {
                "منصه",
                "منصة",
                "منصات",
                "quavron",
            },

            "pricing": {
                "مجاني",
                "مجانيه",
                "مجانية",
                "مدفوع",
                "مدفوعة",
                "مدفوعه",
                "سعر",
                "اسعار",
                "أسعار",
                "اشتراك",
                "اشتراكات",
                "خطه",
                "خطة",
                "خطط",
                "تكلفه",
                "تكلفة",
                "رسوم",
            },

            "ai": {
                "ذكاء",
                "ذكاء اصطناعي",
                "qai",
                "مساعد",
                "مساعد ذكي",
            },

            "learning": {
                "تعلم",
                "تعليم",
                "دوره",
                "دورة",
                "اختبار",
                "معرفه",
                "معرفة",
                "تعلمية",
                "تعلميه",
            },

            "official": {
                "رسمي",
                "رسمية",
                "اعتماد",
                "معتمد",
                "اعتمد",
            },

            "local": {
                "محلي",
                "محليه",
                "محلية",
            },
        }

        query_topics = set()
        text_topics = set()

        for topic, words in topic_groups.items():
            normalized_words = {
                self.normalize(word)
                for word in words
            }

            if any(word in qset for word in normalized_words):
                query_topics.add(topic)

            if any(word in tset for word in normalized_words):
                text_topics.add(topic)

        # ---------------------------------------------------------
        # Strong semantic exclusions
        # ---------------------------------------------------------

        # Explicit official request requires official evidence.
        if "official" in query_topics and "official" not in text_topics:
            return 0

        # Explicit local request requires local evidence.
        if "local" in query_topics and "local" not in text_topics:
            return 0

        # Official and local are different concepts.
        if "official" in query_topics and "local" in text_topics:
            return 0

        if "local" in query_topics and "official" in text_topics:
            return 0

        # If query is about learning/testing and text is only platform
        # identity, platform overlap is not enough.
        if (
            "learning" in query_topics
            and "learning" not in text_topics
        ):
            return 0

        # If query is specifically about pricing, platform identity
        # alone is not sufficient.
        if (
            "pricing" in query_topics
            and "pricing" not in text_topics
        ):
            return 0

        # ---------------------------------------------------------
        # Exact meaningful word matching
        # ---------------------------------------------------------

        score = 0
        matched = 0

        weak_domain_words = {
            "quavron",
            "منصه",
            "منصة",
            "qai",
        }

        for word in qset:
            if word not in tset:
                continue

            matched += 1

            if word in weak_domain_words:
                score += 5
            elif len(word) >= 5:
                score += 30
            else:
                score += 15

        # ---------------------------------------------------------
        # Topic alignment
        # ---------------------------------------------------------

        shared_topics = query_topics & text_topics

        for topic in shared_topics:
            if topic == "pricing":
                score += 35

            elif topic == "learning":
                score += 20

            elif topic == "ai":
                score += 15

            elif topic == "official":
                score += 15

            elif topic == "local":
                score += 15

            elif topic == "platform":
                score += 5

        # ---------------------------------------------------------
        # Partial matching
        # ---------------------------------------------------------

        for qword in qset:
            if len(qword) < 5:
                continue

            for tword in tset:
                if len(tword) < 5:
                    continue

                if qword == tword:
                    continue

                if qword in tword or tword in qword:
                    score += 3

        # ---------------------------------------------------------
        # Coverage
        # ---------------------------------------------------------

        coverage = matched / max(len(qset), 1)

        if len(qset) >= 5 and coverage < 0.30:
            score = min(score, 15)

        elif len(qset) >= 4 and coverage < 0.35:
            score = min(score, 20)

        elif len(qset) >= 3 and coverage < 0.50:
            score = min(score, 30)

        elif len(qset) >= 2 and coverage < 0.50:
            score = min(score, 40)

        # ---------------------------------------------------------
        # Cross-topic protection
        # ---------------------------------------------------------

        if query_topics and text_topics:
            if not shared_topics:
                return 0

        return min(score, 100)

    # =========================================================
    # COMPOUND QUERY DETECTION
    # =========================================================

    def is_compound_query(self, query):

        text = self.normalize(query)

        compound_words = [
            "قارن",
            "مقارنة",
            "الفرق",
            "ما الفرق",
            "ما هو الفرق",
            "أيهما",
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
            word in text
            for word in compound_words
        )

    # =========================================================
    # EXTRACT IMPORTANT CONCEPTS
    # =========================================================

    def extract_concepts(self, query):

        text = self.normalize(query)

        concepts = []

        # -----------------------------------------------------
        # Known Quavron concepts
        #
        # These are deliberately explicit. Later this can
        # become a dynamic concept/entity extractor.
        # -----------------------------------------------------

        known_concepts = [
            "qai",
            "quavron",
            "cloud ide",
            "marketplace",
            "cloud",
            "ide",
            "community",
            "dashboard",
            "hosting",
            "courses",
            "freelance",
            "analytics",
            "social hub",
            "cloud ide",
            "api",
        ]

        for concept in known_concepts:

            if concept in text:
                concepts.append(concept)

        # -----------------------------------------------------
        # Remove duplicates while preserving order
        # -----------------------------------------------------

        cleaned = []
        seen = set()

        for concept in concepts:

            key = self.normalize(concept)

            if key in seen:
                continue

            seen.add(key)
            cleaned.append(concept)

        return cleaned

    def _learning_relevance(self, query, stored_question, answer=""):
        """
        Strict relevance for supervisor-approved QAI learning records.

        Design goals:
        - Exact question remains strongest.
        - Similar wording is allowed only when the semantic intent matches.
        - "course", "learning", "test", "official", "local", and "platform"
          are NOT interchangeable.
        - A course-process question must not retrieve a course-test record.
        - A local-test question must not retrieve an official-test record.
        - A platform identity question must not retrieve a platform-test record.
        - Answer text may reinforce an already-valid match, but can never
          create a match by itself.
        """

        def normalize_learning(value):
            value = self.normalize(str(value or ""))

            # Arabic morphology / spelling normalization used specifically
            # for learning intent detection.
            replacements = {
                "الاختبار": "اختبار",
                "الاختبارات": "اختبارات",
                "الدوره": "دوره",
                "الدورة": "دوره",
                "التعلم": "تعلم",
                "التعليم": "تعليم",
                "المحلي": "محلي",
                "المحليه": "محليه",
                "المحلية": "محليه",
                "الرسمي": "رسمي",
                "الرسمية": "رسمي",
                "المنصه": "منصه",
                "المنصة": "منصه",
                "لمنصه": "لمنصه",
                "لمنصة": "لمنصه",
                "المشرف": "مشرف",
                "المعلم": "معلم",
            }

            for a, b in replacements.items():
                value = value.replace(a, b)

            return " ".join(value.split())

        q = normalize_learning(query)
        s = normalize_learning(stored_question)
        a = normalize_learning(answer)

        if not q or not s:
            return 0

        q_words = set(self.meaningful_words(q))
        s_words = set(self.meaningful_words(s))
        a_words = set(self.meaningful_words(a))

        if not q_words or not s_words:
            return 0

        # ---------------------------------------------------------
        # 1. Exact question
        # ---------------------------------------------------------

        if q == s:
            return 100

        # ---------------------------------------------------------
        # 2. Explicit semantic signatures
        # ---------------------------------------------------------

        def has_any(words, values):
            return bool(words & values)

        # QAI / AI identity
        qai_words = {
            "qai",
            "ذكاء",
            "مساعد",
            "مساعد ذكي",
        }

        # Platform identity
        platform_words = {
            "quavron",
            "منصه",
            "منصات",
        }

        # Learning/course vocabulary
        course_words = {
            "دوره",
            "تعلم",
            "تعليم",
            "تعلميه",
            "تعليميه",
            "مسار",
            "مسار تعليمي",
        }

        # Test vocabulary
        test_words = {
            "اختبار",
            "اختبارات",
            "فحص",
            "تحقق",
        }

        # Official/local markers
        official_words = {
            "رسمي",
            "اعتماد",
            "معتمد",
            "اعتمده",
            "اعتمد",
        }

        local_words = {
            "محلي",
            "محليه",
            "محليًا",
        }

        # Supervisor / teacher learning
        supervisor_words = {
            "مشرف",
            "معلم",
            "مدرس",
            "تعتمد",
            "يعتمد",
        }

        # Question/process markers
        how_words = {
            "كيف",
            "تعمل",
            "يعمل",
            "تعمل",
            "تتم",
            "يتم",
            "طريقه",
            "طريقة",
            "مراحل",
            "خطوات",
        }

        # ---------------------------------------------------------
        # 3. Determine the query's concrete intent
        # ---------------------------------------------------------

        query_has_qai = has_any(q_words, qai_words)
        query_has_platform = has_any(q_words, platform_words)
        query_has_course = has_any(q_words, course_words)
        query_has_test = has_any(q_words, test_words)
        query_has_official = has_any(q_words, official_words)
        query_has_local = has_any(q_words, local_words)
        query_has_supervisor = has_any(q_words, supervisor_words)
        query_has_how = has_any(q_words, how_words)

        # A course/process question is different from a test question.
        query_course_test = (
            query_has_course
            and query_has_test
        )

        query_course_process = (
            query_has_course
            and query_has_how
            and not query_has_test
        )

        query_local_test = (
            query_has_local
            and query_has_test
        )

        query_platform_identity = (
            query_has_platform
            and not query_has_test
            and not query_has_official
        )

        query_platform_official_test = (
            query_has_platform
            and query_has_test
            and query_has_official
        )

        query_supervisor_learning = (
            query_has_supervisor
            and query_has_course
            and not query_has_test
        )

        # ---------------------------------------------------------
        # 4. Determine stored record's concrete intent
        # ---------------------------------------------------------

        stored_has_qai = has_any(s_words, qai_words)
        stored_has_platform = has_any(s_words, platform_words)
        stored_has_course = has_any(s_words, course_words)
        stored_has_test = has_any(s_words, test_words)
        stored_has_official = has_any(s_words, official_words)
        stored_has_local = has_any(s_words, local_words)
        stored_has_supervisor = has_any(s_words, supervisor_words)

        # Also inspect the approved answer. This is useful because
        # supervisor approval metadata may describe the record even
        # when the question itself is short.
        answer_has_official = has_any(a_words, official_words)
        answer_has_local = has_any(a_words, local_words)
        answer_has_supervisor = has_any(a_words, supervisor_words)

        stored_is_official = (
            stored_has_official
            or answer_has_official
        )

        stored_is_local = (
            stored_has_local
            or answer_has_local
        )

        stored_course_test = (
            stored_has_course
            and stored_has_test
        )

        stored_course_process = (
            stored_has_course
            and not stored_has_test
        )

        stored_local_test = (
            stored_is_local
            and stored_has_test
        )

        stored_platform_identity = (
            stored_has_platform
            and not stored_has_test
            and not stored_is_official
        )

        stored_platform_official_test = (
            stored_has_platform
            and stored_has_test
            and stored_is_official
        )

        stored_supervisor_learning = (
            (
                stored_has_supervisor
                or answer_has_supervisor
            )
            and stored_has_course
            and not stored_has_test
        )

        # ---------------------------------------------------------
        # 5. Hard semantic exclusions
        # ---------------------------------------------------------

        # Course-process != course-test
        if query_course_process and stored_course_test:
            return 0

        if query_course_test and stored_course_process:
            return 0

        # Local test != official test
        if query_local_test and not stored_is_local:
            return 0

        if query_has_official and not stored_is_official:
            return 0

        if query_has_local and not stored_is_local:
            return 0

        # Official/local must never cross-match.
        if query_has_official and stored_is_local:
            return 0

        if query_has_local and stored_is_official:
            return 0

        # Platform identity != platform test.
        if query_platform_identity and stored_has_test:
            return 0

        if query_platform_official_test and not stored_platform_official_test:
            return 0

        # A platform question should not be satisfied by a generic
        # course/test record merely because QAI or Quavron appears.
        if query_has_platform and not stored_has_platform:
            return 0

        # A course/test question should not be satisfied by a generic
        # platform identity record.
        if query_has_course and stored_has_platform and not stored_has_course:
            return 0

        # ---------------------------------------------------------
        # 6. Concrete lexical overlap
        # ---------------------------------------------------------

        shared_specific = q_words & s_words

        # Remove weak domain markers from the concrete overlap.
        weak_words = {
            "qai",
            "quavron",
            "منصه",
            "منصات",
            "دوره",
            "تعلم",
            "تعليم",
            "اختبار",
            "رسمي",
            "محلي",
            "مشرف",
            "معلم",
        }

        concrete_overlap = {
            word
            for word in shared_specific
            if word not in weak_words
        }

        # ---------------------------------------------------------
        # 7. Exact intent signatures
        # ---------------------------------------------------------

        # Exact course-test concept:
        # "ما هو الاختبار الرسمي لدورة تعلم QAI؟"
        if query_course_test and stored_course_test:
            score = 72

            if query_has_official and stored_is_official:
                score += 10

            if query_has_qai and stored_has_qai:
                score += 5

            if concrete_overlap:
                score += min(8, len(concrete_overlap) * 4)

            return min(score, 95)

        # Exact local-test concept:
        # "ما هو اختبار التعلم المحلي في QAI؟"
        if query_local_test and stored_local_test:
            score = 85

            if query_has_qai and stored_has_qai:
                score += 5

            if concrete_overlap:
                score += min(5, len(concrete_overlap) * 2)

            return min(score, 100)

        # Exact platform official-test concept.
        if query_platform_official_test and stored_platform_official_test:
            score = 82

            if query_has_qai and stored_has_qai:
                score += 4

            if concrete_overlap:
                score += min(8, len(concrete_overlap) * 3)

            return min(score, 98)

        # Course-process question must retrieve course-process records,
        # not course tests.
        if query_course_process:
            if not stored_course_process:
                return 0

            score = 50

            if query_has_qai and stored_has_qai:
                score += 8

            if concrete_overlap:
                score += min(20, len(concrete_overlap) * 5)

            return min(score, 85)

        # Supervisor learning question must match explicit supervisor
        # learning records, not merely a learning/test record.
        if query_supervisor_learning:
            if not stored_supervisor_learning:
                return 0

            score = 65

            if query_has_qai and stored_has_qai:
                score += 8

            if concrete_overlap:
                score += min(12, len(concrete_overlap) * 4)

            return min(score, 90)

        # Platform identity question.
        if query_platform_identity:
            if not stored_platform_identity:
                return 0

            score = 55

            if query_has_qai and stored_has_qai:
                score += 5

            if concrete_overlap:
                score += min(20, len(concrete_overlap) * 5)

            return min(score, 90)

        # ---------------------------------------------------------
        # 8. Generic fallback
        # ---------------------------------------------------------

        # If both records clearly belong to the same broad learning
        # topic, require actual overlap. Do not let topic labels alone
        # create relevance.
        if query_has_course and stored_has_course:
            if not concrete_overlap:
                return 0

            score = 30 + min(30, len(concrete_overlap) * 8)

            if query_has_qai and stored_has_qai:
                score += 5

            return min(score, 70)

        # QAI alone is never enough.
        if query_has_qai and stored_has_qai:
            if concrete_overlap:
                return min(25 + len(concrete_overlap) * 8, 55)

        return 0

    # =========================================================
    # SINGLE SOURCE SEARCH
    # =========================================================

    def _search_one(self, query, limit=8):

        results = []

        # =====================================================
        # 1. LEARNED KNOWLEDGE
        # =====================================================

        try:

            learned_results = learning_retriever.search(
                query,
                limit=limit
            )

            for item in learned_results:

                text = item.get("answer", "")

                if not text:
                    continue

                question = item.get("question")

                if isinstance(question, dict):
                    question_values = [
                        str(value)
                        for value in question.values()
                        if value
                    ]
                    stored_question = " | ".join(question_values)
                else:
                    stored_question = str(question or "")

                # Supervisor learning:
                # use the stored question as the primary relevance signal.
                rel = self._learning_relevance(
                    query,
                    stored_question,
                    text
                )

                results.append({
                    "text": text,
                    "score": (
                        SOURCE_PRIORITY["qai_learning"]
                        + item.get("score", 0)
                    ),
                    "relevance": rel,
                    "source": "qai_learning",
                    "teacher": item.get("teacher"),
                    "confidence": item.get(
                        "confidence",
                        0
                    ),
                    "approved": item.get(
                        "approved",
                        False
                    ),
                    "question": question,
                })

        except Exception as e:

            print(
                "learning retrieval error:",
                e
            )

        # =====================================================
        # 2. OFFICIAL KNOWLEDGE
        # =====================================================

        try:
            knowledge_results = search_engine.search(
                query
            )

            for item in knowledge_results:

                value = item.get("value")
                text = ""

                if isinstance(value, dict):

                    # Official knowledge records use:
                    #
                    # {
                    #     "question": {...},
                    #     "answer": {
                    #         "ar": "...",
                    #         "en": "...",
                    #         "fr": "..."
                    #     }
                    # }

                    answer = value.get("answer")

                    if isinstance(answer, dict):
                        text = (
                            answer.get("ar")
                            or answer.get("en")
                            or answer.get("fr")
                            or ""
                        )

                    elif answer:
                        text = str(answer)

                    # Backward compatibility with content records.
                    if not text:
                        content = value.get("content")

                        if isinstance(content, dict):
                            text = (
                                content.get("ar")
                                or content.get("en")
                                or content.get("fr")
                                or ""
                            )

                        elif content:
                            text = str(content)

                    # Backward compatibility with title records.
                    if not text:
                        title = value.get("title")

                        if isinstance(title, dict):
                            text = (
                                title.get("ar")
                                or title.get("en")
                                or title.get("fr")
                                or ""
                            )

                        elif title:
                            text = str(title)

                elif value:
                    text = str(value)

                if not text:
                    continue

                rel = self.relevance(
                    query,
                    text
                )

                item_question = item.get(
                    "question"
                )

                if isinstance(item_question, dict):
                    for question_value in item_question.values():
                        rel = max(
                            rel,
                            self.relevance(
                                query,
                                question_value
                            )
                        )

                results.append({
                    "text": text,
                    "score": (
                        SOURCE_PRIORITY["knowledge"]
                        + item.get("score", 0)
                    ),
                    "relevance": rel,
                    "source": "knowledge",
                    "confidence": item.get(
                        "confidence",
                        0
                    ),
                    "approved": item.get(
                        "approved",
                        False
                    ),
                    "question": item_question,
                })

        except Exception as e:
            print(
                "knowledge error:",
                e
            )

        # 3. VECTOR MEMORY
        # =====================================================

        try:

            vector_results = search.search(
                query
            )

            for item in vector_results:

                text = item.get(
                    "text",
                    ""
                )

                if not text:
                    continue

                rel = self.relevance(
                    query,
                    text
                )

                results.append({
                    "text": text,
                    "score": (
                        SOURCE_PRIORITY["vector"]
                        + item.get("score", 0)
                    ),
                    "relevance": rel,
                    "source": "vector",
                })

        except Exception as e:

            print(
                "vector retrieval error:",
                e
            )

        return results

    # =========================================================
    # FILTER + RANK
    # =========================================================

    def _rank_and_clean(self, results):

        filtered = []

        for item in results:

            relevance = float(
                item.get(
                    "relevance",
                    0
                ) or 0
            )

            source = item.get("source")

            # =====================================================
            # SOURCE GUARD
            #
            # Supervisor learning is intentionally stricter than
            # generic/vector knowledge.
            #
            # A qai_learning record must be:
            #   - approved
            #   - confidence >= 1.0
            #   - relevance >= 20
            #
            # This check MUST happen before the generic
            # "relevance >= 40" rule.
            # =====================================================

            if source == "qai_learning":

                if (
                    item.get("approved", False) is not True
                    or float(item.get("confidence", 0) or 0) < 1.0
                    or relevance < 20
                ):
                    continue

                filtered.append(item)
                continue

            # =====================================================
            # STRONG NORMAL RESULT
            # =====================================================

            if relevance >= 40:
                filtered.append(item)
                continue

            # =====================================================
            # MEDIUM TRUSTED KNOWLEDGE
            # =====================================================

            if (
                relevance >= 20
                and source == "knowledge"
            ):
                filtered.append(item)

        # =========================================================
        # FINAL SCORE
        # =========================================================

        for item in filtered:

            relevance = float(
                item.get(
                    "relevance",
                    0
                ) or 0
            )

            item["final_score"] = (
                relevance * 20
                + item.get("score", 0)
            )

        # =========================================================
        # RANKING
        # =========================================================

        filtered.sort(
            key=lambda x: (
                x.get("relevance", 0),
                x.get("final_score", 0),
                x.get("score", 0)
            ),
            reverse=True
        )

        # =========================================================
        # DEDUPLICATION
        # =========================================================

        cleaned = []
        seen = set()

        for item in filtered:

            text = item.get(
                "text",
                ""
            ).strip()

            if not text:
                continue

            fingerprint = self.normalize(text)

            if fingerprint in seen:
                continue

            seen.add(fingerprint)
            cleaned.append(item)

        return cleaned

    # =========================================================
    def retrieve(self, query, limit=8):

        query = str(query or "").strip()

        if not query:
            return []

        # =====================================================
        # 1. NORMAL DIRECT SEARCH
        # =====================================================

        direct_results = self._search_one(
            query,
            limit=limit
        )

        # =====================================================
        # 2. COMPOUND QUERY SEARCH
        #
        # Example:
        #
        # "قارن بين Cloud IDE و Marketplace"
        #
        # Search independently for:
        #
        # Cloud IDE
        # Marketplace
        # Quavron
        # =====================================================

        if self.is_compound_query(query):

            concepts = self.extract_concepts(
                query
            )

            for concept in concepts:

                concept_results = self._search_one(
                    concept,
                    limit=limit
                )

                for item in concept_results:

                    # Mark that this came from
                    # concept-level retrieval.
                    item["retrieval_query"] = concept

                    direct_results.append(item)

        # =====================================================
        # 3. RANK
        # =====================================================

        cleaned = self._rank_and_clean(
            direct_results
        )

        # =====================================================
        # 4. COMPOUND QUERY BALANCING
        #
        # Do not allow one concept to completely dominate
        # the context.
        # =====================================================

        if self.is_compound_query(query):

            concepts = self.extract_concepts(
                query
            )

            balanced = []

            # First collect the best result for each
            # detected concept.
            for concept in concepts:

                concept_norm = self.normalize(
                    concept
                )

                candidates = [
                    item
                    for item in cleaned
                    if concept_norm in self.normalize(
                        item.get("text", "")
                    )
                    or item.get(
                        "retrieval_query"
                    ) == concept
                ]

                if candidates:

                    balanced.append(
                        candidates[0]
                    )

            # Then add remaining best results.
            used = {
                self.normalize(
                    item.get("text", "")
                )
                for item in balanced
            }

            for item in cleaned:

                fingerprint = self.normalize(
                    item.get("text", "")
                )

                if fingerprint in used:
                    continue

                balanced.append(item)
                used.add(fingerprint)

            cleaned = balanced

        return cleaned[:limit]


retriever = Retriever()

import re


def normalize(text):
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

    punctuation = "؟،؛：:,.!?؛()[]{}«»“”‘’ـ-_" + "/" + chr(92)

    for mark in punctuation:
        text = text.replace(mark, " ")

    words = []

    for word in text.split():
        if len(word) > 3 and word.startswith("ال"):
            word = word[2:]
        words.append(word)

    return " ".join(words)


def meaningful_words(text):
    text = normalize(text)

    stop_words = {
        "ما", "هو", "هي", "هل", "من",
        "كيف", "ماذا", "لماذا", "متى",
        "اين", "في", "على", "الى", "عن",
        "مع", "و", "او",
        "لي", "ني", "انا",
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


def learning_relevance(query, stored_question, answer=""):
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
            value = normalize(str(value or ""))

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

        q_words = set(meaningful_words(q))
        s_words = set(meaningful_words(s))
        a_words = set(meaningful_words(a))

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

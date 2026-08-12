class IntentRouter:

    def detect(self, message):
        # -------------------------------------------------
        # QAI supervised-learning / course intent
        # -------------------------------------------------
        # Must run before generic language_learning.
        text = str(message or "").lower()

        is_qai = "qai" in text

        qai_test_markers = [
            "الاختبار الرسمي",
            "اختبار رسمي",
            "اختبار دورة",
            "اختبار التعلم",
            "اختبار اعتماد",
            "اختبار معتمد",
            "اختبار التحقق",
        ]

        qai_course_markers = [
            "دورة تعلم qai",
            "دورة التعلم qai",
            "دوره تعلم qai",
            "دوره التعلم qai",
            "تعلم qai",
            "التعلم qai",
            "qai learning course",
            "qai learning",
        ]

        qai_process_markers = [
            "كيف تعمل",
            "كيف يعمل",
            "كيف تتم",
            "كيف يتم",
            "طريقة عمل",
            "عملية التعلم",
            "طريقة التعلم",
            "كيف يتعلم",
        ]

        has_qai_test = any(
            marker in text
            for marker in qai_test_markers
        )

        has_qai_course = any(
            marker in text
            for marker in qai_course_markers
        )

        has_qai_process = any(
            marker in text
            for marker in qai_process_markers
        )

        # Official QAI learning-course test
        if (
            is_qai
            and has_qai_test
            and (
                has_qai_course
                or "دورة" in text
                or "التعلم" in text
            )
        ):
            return {
                "intent": "learning_test",
                "domain": "qai_learning",
            }

        # QAI learning/course process
        if (
            is_qai
            and (
                has_qai_course
                or has_qai_process
            )
            and (
                "تعلم" in text
                or "التعلم" in text
                or "دورة" in text
            )
        ):
            return {
                "intent": "learning_process",
                "domain": "qai_learning",
            }

        # Supervisor-learning questions
        supervisor_markers = [
            "التعلم من المشرف",
            "تعلم من المشرف",
            "يتعلم من المشرف",
            "qai يتعلم من المشرف",
            "qai تعلم من المشرف",
            "يمكن لـ qai التعلم",
        ]

        if is_qai and any(
            marker in text
            for marker in supervisor_markers
        ):
            return {
                "intent": "supervisor_learning",
                "domain": "qai_learning",
            }

        text = str(message or "").lower()

        # =================================================
        # QAI OFFICIAL LEARNING-COURSE TEST
        # =================================================
        # MUST run before generic "تعلم" language intent.
        qai_test_markers = [
            "اختبار رسمي",
            "الاختبار الرسمي",
            "اختبار دورة",
            "اختبار التعلم",
            "اختبار اعتماد",
            "اختبار معتمد",
            "اختبار التحقق",
        ]

        qai_course_markers = [
            "دورة تعلم qai",
            "دورة التعلم qai",
            "دوره تعلم qai",
            "دوره التعلم qai",
            "التعلم المعتمد",
            "دورة تعلم",
            "دورة التعلم",
        ]

        is_qai = any(x in text for x in [
            "qai",
            "quavron ai",
        ])

        is_official_test = any(
            x in text
            for x in qai_test_markers
        )

        is_qai_course = any(
            x in text
            for x in qai_course_markers
        )

        if is_qai and is_official_test and is_qai_course:
            return {
                "intent": "learning_test",
                "domain": "qai_learning",
            }

        # =================================================
        # QAI LEARNING PROCESS
        # =================================================
        learning_process_markers = [
            "كيف تعمل دورة تعلم qai",
            "كيف تعمل دورة التعلم qai",
            "كيف يعمل تعلم qai",
            "كيف يتعلم qai",
            "عملية تعلم qai",
            "طريقة تعلم qai",
            "التعلم من المشرف",
            "تعلم من المشرف",
        ]

        if is_qai and any(
            x in text
            for x in learning_process_markers
        ):
            return {
                "intent": "learning_process",
                "domain": "qai_learning",
            }

        # =================================================
        # SUPERVISOR LEARNING
        # =================================================
        supervisor_learning_markers = [
            "هل يستطيع qai التعلم من المشرف",
            "هل يمكن qai التعلم من المشرف",
            "qai يتعلم من المشرف",
            "qai تعلم من المشرف",
            "تعلم qai من المشرف",
        ]

        if any(
            x in text
            for x in supervisor_learning_markers
        ):
            return {
                "intent": "supervisor_learning",
                "domain": "qai_learning",
            }

        # Translation
        if any(x in text for x in [
            "translate",
            "translation",
            "ترجم",
            "ترجمة",
            "traduire",
            "bonjour",
            "hello",
            "meaning",
            "معنى"
        ]):
            return {
                "intent": "translation",
                "domain": "languages"
            }

        # Language learning
        if any(x in text for x in [
            "learn english",
            "learn french",
            "learn arabic",
            "teach me english",
            "teach me french",
            "teach me arabic",
            "تعلم",
            "درس",
            "قواعد",
            "grammar",
            "vocabulary",
            "pronunciation",
            "language"
        ]):
            return {
                "intent": "language_learning",
                "domain": "languages"
            }

        # Programming
        if any(x in text for x in [
            "python",
            "javascript",
            "react",
            "code",
            "coding",
            "programming",
            "برمجة",
            "كود",
            "تطوير"
        ]):
            return {
                "intent": "programming",
                "domain": "technology"
            }

        # Quavron platform
        if any(x in text for x in [
            "quavron",
            "qai",
            "cloud ide",
            "marketplace",
            "dashboard"
        ]):
            return {
                "intent": "platform",
                "domain": "quavron"
            }

        return {
            "intent": "general",
            "domain": "general"
        }


router = IntentRouter()

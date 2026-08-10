class IntentRouter:

    def detect(self, message):

        text = message.lower()

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

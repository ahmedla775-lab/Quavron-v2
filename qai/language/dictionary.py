class LanguageDictionary:

    def __init__(self):

        self.words = {

            # Arabic
            "ما هو": "what is",
            "ما هي": "what is",
            "منصة": "platform",
            "شركة": "company",
            "السوق الرقمي": "digital marketplace",
            "سوق رقمي": "digital marketplace",
            "ذكاء اصطناعي": "artificial intelligence",

            # Algerian Darija
            "واش": "what is",
            "وش": "what is",
            "شكون": "who is",
            "واش هو": "what is",
            "دير": "build",
            "خدمة": "service",

            # French
            "qu'est ce que": "what is",
            "plateforme": "platform",
            "entreprise": "company",
            "marché numérique": "digital marketplace",
            "intelligence artificielle": "artificial intelligence",

            # English
            "what is": "what is",
            "platform": "platform",
            "company": "company",
            "marketplace": "marketplace",
            "build": "build"
        }


    def normalize(self, text):

        text = text.lower()

        for word, replacement in sorted(
            self.words.items(),
            key=lambda x: len(x[0]),
            reverse=True
        ):

            if word in text:
                text = text.replace(
                    word,
                    replacement
                )

        return text



dictionary = LanguageDictionary()

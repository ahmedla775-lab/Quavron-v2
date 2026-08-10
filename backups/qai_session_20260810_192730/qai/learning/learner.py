class Learner:

    def __init__(self):

        self.learned = {

            "واش هو كافرون":
            "Quavron هي شركة تكنولوجيا تبني نظاما رقميا متكاملا يجمع الذكاء الاصطناعي، البرمجة، المجتمع، الاستضافة والسوق الرقمي.",

            "ما هو كافرون":
            "Quavron SARL هي منصة رقمية من الجيل القادم تجمع الذكاء الاصطناعي والتطوير والخدمات الرقمية.",

            "ما هو السوق الرقمي":
            "السوق الرقمي هو منصة منظمة تربط المستخدمين بالمنتجات والخدمات والأعمال.",

            "واش هو السوق الرقمي":
            "السوق الرقمي هو فضاء إلكتروني لربط المستخدمين بالمنتجات والخدمات والأعمال."
        }


    def get(self, text):

        text = text.lower()

        for key, value in self.learned.items():

            if key in text:

                return value

        return None


    def learn(self, question, answer):

        self.learned[question.lower()] = answer


learner = Learner()

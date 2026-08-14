import re
from html import unescape


class KnowledgeCleaner:
    """
    تنظيف المادة الخام دون اتخاذ قرار نهائي حول صحتها.

    هذه الطبقة:
    - تنظف HTML entities
    - توحد المسافات
    - تزيل الضوضاء الشكلية
    - تحافظ على النص الأصلي
    """

    @staticmethod
    def clean(text):
        if not text:
            return ""

        text = unescape(str(text))

        # توحيد الأسطر
        text = text.replace("\r", "\n")

        # إزالة المسافات الزائدة
        text = re.sub(r"[ \t]+", " ", text)

        # تقليل الأسطر الفارغة
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()

    def process(self, document):
        original_content = document.get("content", "") or ""
        original_snippet = document.get("snippet", "") or ""
        original_title = document.get("title", "") or ""

        return {
            **document,

            # الاحتفاظ بالأصل
            "raw_title": original_title,
            "raw_snippet": original_snippet,
            "raw_content": original_content,

            # النسخة المنظفة
            "title": self.clean(original_title),
            "snippet": self.clean(original_snippet),
            "content": self.clean(original_content),

            "cleaning": {
                "title_changed": (
                    self.clean(original_title)
                    != original_title
                ),
                "snippet_changed": (
                    self.clean(original_snippet)
                    != original_snippet
                ),
                "content_changed": (
                    self.clean(original_content)
                    != original_content
                ),
            },
        }

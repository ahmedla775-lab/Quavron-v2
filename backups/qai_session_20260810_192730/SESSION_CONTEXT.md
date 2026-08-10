# QUAVRON / QAI — SESSION BACKUP
## Date
2026-08-10

## Purpose
هذه النسخة الاحتياطية هي نقطة الانتقال الرسمية من هذه الجلسة إلى جلسة جديدة.
يجب اعتبار ملفات qai الموجودة داخل هذه النسخة هي snapshot لحالة المشروع وقت إنشاء النسخة.

---

# 1. المشروع

Quavron = Next Generation Platform

QAI = Quavron AI
وهو المساعد الذكي داخل منظومة Quavron.

بيئة التطوير:
- Android / Termux
- المشروع الرئيسي: ~/Quavron
- QAI: ~/Quavron/qai
- Frontend: ~/Quavron/frontend

---

# 2. الهدف الحالي لـ QAI

الهدف ليس الاعتماد دائمًا على OpenAI أو خدمات AI مدفوعة.

المطلوب أن يصبح QAI قادرًا على:
- فهم الأسئلة.
- استرجاع المعرفة المحلية.
- استخدام RAG.
- التعلم من المعرفة المعتمدة.
- الإجابة بالعربية والإنجليزية والفرنسية.
- معرفة Quavron ومنظومتها.
- الإجابة عن الأسئلة العامة، وليس فقط أسئلة Quavron.
- استخدام المعرفة المعتمدة من المشرف.
- الاحتفاظ بالذاكرة حسب المستخدم.
- التطور تدريجيًا نحو نظام AI محلي مستقل قدر الإمكان.

OpenAI موجود حاليًا كـ driver / مصدر خارجي عند الحاجة، لكنه ليس الحل النهائي المجاني.

---

# 3. آخر حالة ناجحة

السؤال:

ماهو Quavron

يعطي:

Quavron هي منصة Next Generation Platform.

والاختبار الداخلي أظهر:

PROVIDER: local
DOCUMENTS: 1
SOURCE: qai_learning
CONFIDENCE: 0.95

إذن مسار المعرفة المعتمدة يعمل على الأقل في هذه الحالة.

---

# 4. المشكلة الحالية

QAI لا يجيب حاليًا على بعض الأسئلة العامة البسيطة.

أمثلة:

أين يقع نهر النيل؟
ما هي عاصمة فلسطين؟
ما هي الشبكة العصبية؟

النتيجة:

لا أملك حاليًا معلومات موثوقة كافية للإجابة عن هذا السؤال.

بينما:

ماهو Quavron

يعمل.

---

# 5. مكان رسالة الفشل

الرسالة:

لا أملك حاليًا معلومات موثوقة كافية للإجابة عن هذا السؤال.

وجدت في:

qai/llm/drivers/local.py

وفي:

qai/llm/drivers/local.py.before_intent_reasoning

كما توجد نسخ من نفس الرد داخل:

qai/memory/storage/memory.json

هذه النتائج لا تعني أن memory.json هو سبب المشكلة.
المصدر الفعلي للرد المحلي هو LocalDriver.

---

# 6. LocalDriver

الملف:

qai/llm/drivers/local.py

يحتوي:

NO_ANSWER = "لا أملك حاليًا معلومات موثوقة كافية للإجابة عن هذا السؤال."

ويحتوي على:
- normalization
- parsing لـ RAG documents
- question echo detection
- language / keyword handling
- intent matching
- document scoring
- hard intent boundaries
- answer generation

يجب تعديل هذا الملف بحذر وعدم كسر منطق:
- approved learning
- intent boundaries
- supervisor approval
- confidence
- Quavron-specific knowledge

---

# 7. Gateway

الملف:

qai/llm/gateway.py

يحتوي:

LLMGateway

وهو يرسل الطلب إلى driver المسجل.

تم تسجيل:

local
openai

والـ local driver متاح دائمًا:

available() -> True

---

# 8. RAG Retriever

الملف:

qai/rag/retriever.py

يستخدم:

from vector_memory.search import search
from knowledge.search.search import search_engine
from learning.datasets.retriever import learning_retriever

الأولوية:

qai_learning = 300
knowledge = 200
web = 250
vector = 100

---

# 9. Relevance الحالية

Retriever.normalize() حاليًا يحول:

أ -> ا
إ -> ا
آ -> ا
ى -> ي
ة -> ه

ثم:

return " ".join(text.split())

المشكلة التي كنا نحاول إصلاحها:
الأسئلة العربية مثل:

الشبكة العصبية
ما هي الشبكة العصبية؟

لا تتطابق بشكل جيد مع:

شبكة عصبية اصطناعية

اختبارات relevance الحالية أعطت:

الشبكة العصبية
-> شبكة عصبية اصطناعية
RELEVANCE = 3

ما هي الشبكة العصبية؟
-> شبكة عصبية اصطناعية
RELEVANCE = 3

ما هو Neural Network
-> شبكة عصبية اصطناعية
RELEVANCE = 0

What is Neural Network
-> Neural Network
RELEVANCE = 60

ما هو الذكاء الاصطناعي؟
-> الذكاء الاصطناعي
RELEVANCE = 33

ما هو تعلم الآلة؟
-> تعلم الآلة
RELEVANCE = 38

---

# 10. محاولة تعديل normalization

تمت محاولة استبدال normalize() لإضافة معالجة أفضل للعربية.

لكن السكربت أعطى:

TARGET BLOCK NOT FOUND - no changes made

ثم تم فحص الدالة فعليًا ووجد أنها:

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

    return " ".join(text.split())

إذن لم يتم اعتماد التعديل الجديد في تلك اللحظة.

---

# 11. Vector Memory

الملفات:

qai/vector_memory/search.py
qai/vector_memory/store.py
qai/vector_memory/store.json

store.json يحتوي تقريبًا:

3918 items

والبنية عبارة عن list.

VectorSearch ليس embedding-based حقيقيًا حاليًا.
هو lexical matching بسيط.

search.py يقوم بـ:
- normalize
- إزالة stop words
- مطابقة الكلمات
- partial matching
- إعطاء score

---

# 12. نتائج Vector Search

Neural Network:
- COUNT: 209
- Neural Network حصلت على SCORE 12
- Advanced machine learning using neural networks حصلت على SCORE 7

شبكة عصبية اصطناعية:
- COUNT: 6
- exact entry حصلت على SCORE 18

الشبكة العصبية:
- COUNT: 4
- أفضل نتيجة:
  نظام يراقب ويحمي حركة الشبكة.
- ثم:
  شبكة عصبية اصطناعية

Artificial Intelligence:
- COUNT: 696

الذكاء الاصطناعي:
- COUNT: 19
- توجد معرفة جيدة نسبيًا.

Machine Learning:
- COUNT: 467

تعلم الآلة:
- COUNT: 25

إذن المشكلة ليست عدم وجود البيانات فقط.
المشكلة الرئيسية هي retrieval / relevance / semantic matching ثم طريقة اختيار السياق والإجابة.

---

# 13. RAG raw tests

تم اختبار:

Neural Network
Artificial Intelligence
Machine Learning
الشبكة العصبية
أين يقع نهر النيل؟
ما هي عاصمة فلسطين؟
ماهو Quavron

وكانت النتائج:

Neural Network:
vector REL=100 SCORE=112 FINAL=2112
TEXT=Neural Network

Artificial Intelligence:
vector REL=100 SCORE=112 FINAL=2112
TEXT=Artificial Intelligence

Machine Learning:
vector REL=100 SCORE=112 FINAL=2112
TEXT=Machine Learning

الشبكة العصبية:
COUNT=0 بعد rank/clean

أين يقع نهر النيل:
COUNT=0

ما هي عاصمة فلسطين:
COUNT=0

ماهو Quavron:
qai_learning
REL=55
SCORE=460
FINAL=1560
TEXT=Quavron هي منصة Next Generation Platform.

---

# 14. WebResearch

أثناء البحث ظهرت رسائل مثل:

[WebResearch] Fetch failed: ...

ومن أمثلتها:
- Facebook URLs
- StackOverflow URLs
- Google Trends
- ScienceDirect

البحث الشبكي الحالي ليس مصدرًا موثوقًا كافيًا بحد ذاته، ولا يجب أن نحل مشكلة QAI بمجرد رفع أولوية web.

يجب أولًا إصلاح local knowledge + retrieval.

---

# 15. Knowledge architecture

المسار الحالي تقريبًا:

Question
  ↓
Brain
  ↓
RAG / Retriever
  ↓
knowledge
vector memory
qai_learning
web research
  ↓
rank / clean
  ↓
context
  ↓
LocalDriver
  ↓
answer

كما توجد:
learning.bridge
learning datasets
supervisor approval
qai_learning

---

# 16. Supervisor-approved learning

تم سابقًا إنشاء/اختبار دورة تعلم رسمية من المشرف.

المفهوم:

المعلم / المشرف
→ learning bridge
→ قاعدة المعرفة
→ RAG
→ QAI

وتم اختبار سؤال رسمي متعلق بدورة التعلم.

يجب عدم كسر هذا المسار عند إصلاح الأسئلة العامة.

---

# 17. قاعدة مهمة

لا نريد حلًا ساذجًا من نوع:

إذا لم يجد RAG نتيجة:
اعطِ أي إجابة من الإنترنت.

ولا نريد:

كل سؤال -> OpenAI.

المطلوب هو بناء retrieval قوي تدريجيًا.

---

# 18. المطلوب في الجلسة الجديدة

البدء من هذه النقطة فقط.

أولًا:
1. فحص snapshot والـ git status.
2. تحديد هل النسخة الاحتياطية كاملة.
3. فحص git commit الحالي.
4. فحص الملفات التي تغيرت.
5. عدم تعديل أي ملف قبل تشخيص المشكلة.
6. إصلاح Arabic semantic normalization / matching.
7. تحسين retrieval العام.
8. اختبار:
   - أين يقع نهر النيل؟
   - ما هي عاصمة فلسطين؟
   - ما هي الشبكة العصبية؟
   - ما هو الذكاء الاصطناعي؟
   - ما هو تعلم الآلة؟
   - ماهو Quavron
9. التأكد أن QAI لا يزال يحترم المعرفة المعتمدة من المشرف.
10. بعد نجاح الاختبارات فقط:
    npm run build
    Firebase Hosting
    git add / commit / push

---

# 19. آخر نقطة توقف

آخر أمر مهم تم تنفيذه:

python - <<'PY'
from rag.retriever import retriever

queries = [
    "الشبكة العصبية",
    "ما هي الشبكة العصبية؟",
    "أين يقع نهر النيل؟",
    "ما هي عاصمة فلسطين؟",
    "ما هو الذكاء الاصطناعي؟",
    "ما هو تعلم الآلة؟",
    "ماهو Quavron",
]

for q in queries:
    results = retriever.retrieve(q, limit=10)
    ...
PY

والنتيجة:

الشبكة العصبية -> COUNT 0
ما هي الشبكة العصبية؟ -> COUNT 0
أين يقع نهر النيل؟ -> COUNT 0
ما هي عاصمة فلسطين؟ -> COUNT 0
ما هو الذكاء الاصطناعي؟ -> COUNT 0
ما هو تعلم الآلة؟ -> COUNT 0
ماهو Quavron -> نتيجة واحدة صحيحة من qai_learning

---

# 20. Backup location

النسخة الحالية:

~/Quavron/backups/qai_session_20260810_192730/

QAI snapshot:

~/Quavron/backups/qai_session_20260810_192730/qai

---

# 21. Important workflow rule

المستخدم يعمل في Termux على Android.

يفضل إعطاء أوامر مباشرة قابلة للنسخ والتنفيذ.

لا تستخدم nano إلا إذا طلب المستخدم ذلك.
يفضل Python heredoc أو sed أو cat أو أوامر shell المباشرة.

لا تبدأ تغييرات واسعة قبل عرض التشخيص.

---

# END OF SESSION CONTEXT

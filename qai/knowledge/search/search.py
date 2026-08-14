import json
import re
import urllib.parse
import urllib.request
import urllib.error
from pathlib import Path
from html.parser import HTMLParser


# =========================================================
# HTML TEXT EXTRACTOR
# =========================================================

class HTMLTextExtractor(HTMLParser):
    BLOCK_TAGS = {
        "p",
        "div",
        "article",
        "section",
        "main",
        "header",
        "footer",
        "li",
        "ul",
        "ol",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "br",
        "tr",
    }

    IGNORE_TAGS = {
        "script",
        "style",
        "noscript",
        "svg",
        "canvas",
        "template",
        "iframe",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.ignore_depth = 0
        self.title_parts = []
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()

        if tag in self.IGNORE_TAGS:
            self.ignore_depth += 1
            return

        if tag == "title":
            self.in_title = True

        if self.ignore_depth == 0 and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        tag = tag.lower()

        if tag in self.IGNORE_TAGS:
            if self.ignore_depth > 0:
                self.ignore_depth -= 1
            return

        if tag == "title":
            self.in_title = False

        if self.ignore_depth == 0 and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        if self.ignore_depth > 0:
            return

        text = str(data or "").strip()

        if not text:
            return

        if self.in_title:
            self.title_parts.append(text)

        self.parts.append(text)

    def text(self):
        value = " ".join(self.parts)
        value = re.sub(r"\s+", " ", value).strip()
        return value

    def title(self):
        value = " ".join(self.title_parts)
        return re.sub(r"\s+", " ", value).strip()


# =========================================================
# KNOWLEDGE + WEB RESEARCH ENGINE
# =========================================================

class KnowledgeSearch:

    USER_AGENT = (
        "Mozilla/5.0 "
        "(Linux; Android 13) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/131.0 Mobile Safari/537.36 "
        "Quavron-QAI-Research/1.0"
    )

    SOURCE_TIMEOUT = 12
    MAX_PAGE_CHARS = 12000
    MAX_WEB_RESULTS = 6

    SOURCE_PRIORITY = {
        "knowledge": 300,
        "web": 250,
    }

    def __init__(self):
        self.knowledge = {}
        self.path = (
            Path(__file__).resolve().parents[1]
            / "store"
            / "quavron_knowledge.json"
        )
        self.load()

    # =====================================================
    # LOCAL KNOWLEDGE
    # =====================================================

    def load(self):
        if not self.path.exists():
            return

        try:
            with open(
                self.path,
                "r",
                encoding="utf-8",
            ) as file:
                self.knowledge = json.load(file)

        except Exception as e:
            print(
                "[KnowledgeSearch] Load error:",
                type(e).__name__,
                str(e),
            )

    # =====================================================
    # NORMALIZATION
    # =====================================================

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

        return text

    # =====================================================
    # KEYWORDS
    # =====================================================

    def extract_keywords(self, text):

        text = self.normalize(text)

        stop_words = {
            "ما",
            "هو",
            "هي",
            "هل",
            "من",
            "عن",
            "كيف",
            "لماذا",
            "ماذا",
            "اشرح",
            "اخبرني",
            "لي",
            "اريد",
            "اريد ان",
            "the",
            "what",
            "is",
            "about",
            "tell",
            "me",
            "how",
            "why",
            "can",
            "do",
            "please",
        }

        words = re.findall(
            r"[\w\u0600-\u06ff.-]+",
            text,
            flags=re.UNICODE,
        )

        return [
            word
            for word in words
            if word
            and word not in stop_words
            and len(word) >= 2
        ]

    # =====================================================
    # MULTILINGUAL TEXT
    # =====================================================

    def multilingual_text(self, value):

        if isinstance(value, str):
            return value

        if isinstance(value, dict):

            parts = []

            for language in ("ar", "en", "fr"):

                if value.get(language):
                    parts.append(
                        str(value[language])
                    )

            return " ".join(parts)

        return ""

    # =====================================================
    # LOCAL SEARCH
    # =====================================================

    def _local_search(self, keyword):

        keywords = self.extract_keywords(keyword)

        if not keywords:
            return []

        results = []

        # -------------------------------------------------
        # Query intent + exact subject extraction
        # -------------------------------------------------

        query_normalized = self.normalize(keyword)

        # -------------------------------------------------
        # Detect query type
        # -------------------------------------------------
        is_definition_query = any(
            phrase in query_normalized
            for phrase in (
                "ما هو",
                "ما هي",
                "ما معنى",
                "ما المقصود",
                "what is",
                "what are",
                "who is",
                "qu est ce que",
                "qu est-ce que",
            )
        )

        is_yes_no_query = any(
            phrase in query_normalized
            for phrase in (
                "هل ",
                "هل",
                "can ",
                "do ",
                "does ",
                "is ",
                "are ",
                "est-ce",
                "est ce",
            )
        )

        # -------------------------------------------------
        # Extract subject from the query
        # -------------------------------------------------
        def extract_subject(value):
            value = self.normalize(value)

            prefixes = (
                "ما هو ",
                "ما هي ",
                "ما معنى ",
                "ما المقصود ب",
                "what is ",
                "what are ",
                "who is ",
                "qu est ce que ",
                "qu est-ce que ",
            "qu’est ce que ",
            "qu’est-ce que ",
            )

            for prefix in prefixes:
                if value.startswith(prefix):
                    value = value[len(prefix):]
                    break

            # Remove common Arabic structural words.
            value = re.sub(
                r"^(منصة|المنصة|في|عن)\s+",
                "",
                value,
            ).strip()

            return value

        query_subject = extract_subject(query_normalized)

        # Subject tokens are used only when necessary.
        subject_words = [
            word
            for word in re.findall(
                r"[\w\u0600-\u06ff.-]+",
                query_subject,
                flags=re.UNICODE,
            )
            if len(word) >= 2
        ]

        subject_words = list(dict.fromkeys(subject_words))

        # -------------------------------------------------
        # Score text
        # -------------------------------------------------
        def score_text(text, title="", question=""):
            normalized = self.normalize(text)
            title_text = self.normalize(title)
            question_text = self.normalize(question)

            # -------------------------------------------------
            # Subject guard for definition queries
            # -------------------------------------------------
            # Prevent unrelated knowledge records from winning
            # merely because they contain generic query words.
            if is_definition_query and query_subject:
                subject_present = (
                    query_subject in normalized
                    or query_subject in title_text
                    or query_subject in question_text
                )

                if not subject_present:
                    return 0

            score = 0

            # -------------------------------------------------
            # Basic keyword matching
            # -------------------------------------------------
            for word in keywords:
                if word in normalized:
                    score += 10

            # -------------------------------------------------
            # Exact query match
            # -------------------------------------------------
            if query_normalized:
                if query_normalized == question_text:
                    score += 1200
                elif query_normalized in question_text:
                    score += 700

                if query_normalized == title_text:
                    score += 1000
                elif query_normalized in title_text:
                    score += 500

            # -------------------------------------------------
            # Exact subject matching
            # -------------------------------------------------
            subject_exact_question = (
                bool(query_subject)
                and query_subject == extract_subject(question_text)
            )

            subject_exact_title = (
                bool(query_subject)
                and query_subject == extract_subject(title_text)
            )

            if subject_exact_question:
                score += 900

            if subject_exact_title:
                score += 750

            # -------------------------------------------------
            # Subject token matching
            # -------------------------------------------------
            matched_question = 0
            matched_title = 0
            matched_content = 0

            for word in subject_words:
                if word in question_text:
                    matched_question += 1

                if word in title_text:
                    matched_title += 1

                if word in normalized:
                    matched_content += 1

            score += matched_question * 100
            score += matched_title * 70
            score += matched_content * 10

            # -------------------------------------------------
            # Definition intent
            # -------------------------------------------------
            if is_definition_query:
                # A definition result must actually answer the
                # requested subject, not merely mention it.
                if subject_exact_question:
                    score += 1400
                elif subject_exact_title:
                    score += 1100
                elif matched_question:
                    score += matched_question * 30

                # Strongly prefer question/title matches over
                # generic knowledge leaves.
                if question_text:
                    score += 250

            # -------------------------------------------------
            # Yes / No intent
            # -------------------------------------------------
            elif is_yes_no_query:
                if matched_question:
                    score += matched_question * 120

                # A question-form knowledge record is preferable
                # to a generic concept when the query is yes/no.
                if question_text:
                    score += 100

            # -------------------------------------------------
            # Entity-aware exact subject protection
            # -------------------------------------------------
            # Prevent unrelated records containing the same entity
            # (e.g. Quavron, QAI, AI) from outranking the exact FAQ.
            if query_subject:
                entity = self.normalize(query_subject)

                if entity:
                    if question_text:
                        if extract_subject(question_text) == entity:
                            score += 1200
                        elif entity in question_text:
                            score += 120

                    if title_text:
                        if extract_subject(title_text) == entity:
                            score += 1000
                        elif entity in title_text:
                            score += 100

            return score

        def make_result(
            *,
            key,
            value,
            score,
            title="",
            question="",
            category=None,
            content="",
        ):
            content = str(content or "").strip()

            if not content:
                content = self.multilingual_text(value).strip()

            if not content:
                return

            final_score = int(score)

            results.append({
                "key": key,
                "value": value,
                "question": question,
                "category": category,
                "score": final_score,
                "relevance": min(final_score, 100),
                "final_score": final_score,
                "source": "knowledge",
                "title": title or str(key),
                "url": None,
                "content": content,
                "text": content,
                "approved": True,
                "confidence": 1.0,
                "teacher": "knowledge",
                "external": False,
            })

        def add_faq_result(data):
            question = data.get("question")
            answer = data.get("answer")

            if not answer:
                return

            question_text = self.multilingual_text(
                question
            ).strip()

            answer_text = self.multilingual_text(
                answer
            ).strip()

            if not answer_text:
                return

            question_score = score_text(
                question_text,
                title=question_text,
                question=question_text,
            )

            answer_score = score_text(
                answer_text,
                title=question_text,
                question=question_text,
            )

            total = (
                question_score * 5
                + answer_score
            )

            if total <= 0:
                return

            make_result(
                key="faq",
                value={
                    "question": question,
                    "answer": answer,
                },
                score=total,
                title=question_text,
                question=question,
                category=data.get("category"),
                content=answer_text,
            )

        def add_multilingual_result(
            key,
            data,
            path_score=0,
        ):
            if not isinstance(data, dict):
                return

            text = self.multilingual_text(data).strip()

            if not text:
                return

            text_score = score_text(text)

            if text_score <= 0:
                return

            title = (
                self.multilingual_text(
                    data.get("title", "")
                ).strip()
                or str(key)
            )

            make_result(
                key=key,
                value=data,
                score=path_score + text_score + 50,
                title=title,
                question=data.get("question", ""),
                category=data.get("category"),
                content=text,
            )

        def scan(data, parent=None, path=None):
            if path is None:
                path = []

            # -----------------------------------------
            # FAQ record
            # -----------------------------------------

            if isinstance(data, dict):

                if (
                    "question" in data
                    and "answer" in data
                ):
                    add_faq_result(data)
                    return

                # -----------------------------------------
                # Explicit content record
                # -----------------------------------------

                if "content" in data:
                    content = data.get("content")

                    text_value = self.multilingual_text(
                        content
                    ).strip()

                    score = score_text(text_value)

                    if score:
                        make_result(
                            key=parent,
                            value=data,
                            score=score + 50,
                            title=(
                                self.multilingual_text(
                                    data.get("title", "")
                                ).strip()
                                or str(parent)
                            ),
                            question=data.get(
                                "question",
                                "",
                            ),
                            category=data.get(
                                "category"
                            ),
                            content=text_value,
                        )

                    return

                # -----------------------------------------
                # Multilingual leaf / concept
                # -----------------------------------------

                language_values = {
                    key: value
                    for key, value in data.items()
                    if key in {"ar", "en", "fr"}
                }

                if language_values:

                    multilingual_text = self.multilingual_text(
                        language_values
                    ).strip()

                    text_score = score_text(
                        multilingual_text,
                        title=str(parent or ""),
                        question=str(parent or ""),
                    )

                    key_score = score_text(
                        str(parent or ""),
                        title=str(parent or ""),
                        question=str(parent or ""),
                    )

                    if text_score or key_score:

                        # Exact concept/question words are
                        # more important than generic matches.

                        concept_score = (
                            text_score
                            + key_score * 3
                        )

                        make_result(
                            key=parent,
                            value=data,
                            score=concept_score + 50,
                            title=str(parent or ""),
                            content=multilingual_text,
                        )

                    # Do not stop here: nested multilingual
                    # dictionaries may contain additional data.

                # -----------------------------------------
                # Nested knowledge
                # -----------------------------------------

                for key, value in data.items():

                    if key in {
                        "ar",
                        "en",
                        "fr",
                    }:
                        continue

                    if key in {
                        "content",
                        "keywords",
                        "title",
                    }:
                        continue

                    child_path = (
                        path + [str(key)]
                    )

                    key_score = score_text(
                        str(key)
                    )

                    if key_score:

                        nested_text = (
                            self.multilingual_text(
                                value
                            ).strip()
                        )

                        if nested_text:

                            make_result(
                                key=key,
                                value=value,
                                score=key_score * 2,
                                title=str(key),
                                content=nested_text,
                            )

                    scan(
                        value,
                        parent=key,
                        path=child_path,
                    )

            elif isinstance(data, list):

                for item in data:
                    scan(
                        item,
                        parent=parent,
                        path=path,
                    )

        scan(self.knowledge)

        # -----------------------------------------
        # Ranking
        # -----------------------------------------

        results.sort(
            key=lambda x: (
                float(
                    x.get(
                        "final_score",
                        x.get("score", 0),
                    )
                    or 0
                ),
                float(
                    x.get(
                        "relevance",
                        0,
                    )
                    or 0
                ),
            ),
            reverse=True,
        )

        # -----------------------------------------
        # Deduplicate
        # -----------------------------------------

        cleaned = []
        seen = set()

        for item in results:

            value = item.get("value")

            fingerprint = (
                item.get("question", "")
                or item.get("title", "")
                or str(value)
            )

            fingerprint = (
                self.normalize(
                    str(fingerprint)
                )
                [:500]
            )

            if fingerprint in seen:
                continue

            seen.add(fingerprint)
            cleaned.append(item)

        return cleaned[:8]

    # =====================================================
    # WEB HTTP
    # =====================================================

    def _encode_url(self, url):
        """Encode Unicode characters in URL path/query for HTTP requests."""
        try:
            parts = urllib.parse.urlsplit(str(url))
            path = urllib.parse.quote(
                parts.path,
                safe="/:@-._~!$&'()*+,;="
            )
            query = urllib.parse.quote(
                parts.query,
                safe="=&?/:@-._~!$'()*+,;[]"
            )
            return urllib.parse.urlunsplit((
                parts.scheme,
                parts.netloc,
                path,
                query,
                parts.fragment,
            ))
        except Exception:
            return str(url)

    def _http_get(self, url):

        request_url = self._encode_url(url)

        request = urllib.request.Request(
            request_url,
            headers={
                "User-Agent": self.USER_AGENT,
                "Accept": (
                    "text/html,"
                    "application/xhtml+xml,"
                    "application/xml;q=0.9,"
                    "*/*;q=0.8"
                ),
                "Accept-Language": (
                    "ar,en-US;q=0.9,en;q=0.8"
                ),
            },
        )

        try:

            with urllib.request.urlopen(
                request,
                timeout=self.SOURCE_TIMEOUT,
            ) as response:

                content_type = (
                    response.headers.get(
                        "Content-Type",
                        "",
                    )
                ).lower()

                if (
                    "text/html" not in content_type
                    and "application/xhtml" not in content_type
                ):
                    return None

                raw = response.read(
                    2_000_000
                )

                # Empty/invalid responses are not research pages.
                if not raw:
                    return None

                # -------------------------------------------------
                # HTTP Content-Encoding
                # -------------------------------------------------
                # Some websites return compressed HTML.
                # urllib does not automatically decompress all
                # Content-Encoding responses.
                content_encoding = (
                    response.headers.get(
                        "Content-Encoding",
                        "",
                    )
                    or ""
                ).lower().strip()

                if content_encoding:
                    encodings = [
                        value.strip()
                        for value in content_encoding.split(',')
                        if value.strip()
                    ]

                    # Decompress in reverse order.
                    for encoding in reversed(encodings):

                        if encoding in {
                            "identity",
                            "",
                        }:
                            continue

                        try:
                            if encoding == "gzip":
                                import gzip
                                raw = gzip.decompress(raw)

                            elif encoding == "deflate":
                                import zlib
                
                                try:
                                    raw = zlib.decompress(raw)
                                except zlib.error:
                                    raw = zlib.decompress(
                                        raw,
                                        -zlib.MAX_WBITS,
                                    )

                            else:
                                print(
                                    "[WebResearch] Unsupported "
                                    "Content-Encoding:",
                                    encoding,
                                )
                                return None

                        except Exception as e:
                            print(
                                "[WebResearch] Decompression failed:",
                                encoding,
                                type(e).__name__,
                            )
                            return None

                charset = (
                    response.headers.get_content_charset()
                    or "utf-8"
                )

                try:
                    return raw.decode(
                        charset,
                        errors="replace",
                    )

                except LookupError:
                    return raw.decode(
                        "utf-8",
                        errors="replace",
                    )

        except Exception as e:

            print(
                "[WebResearch] Fetch failed:",
                url,
                type(e).__name__,
            )

            return None

    # =====================================================
    # SEARCH DISCOVERY
    # =====================================================

    def _discover_urls(self, query):
        """
        Discover external research URLs.

        DuckDuckGo is intentionally not used here because its HTML endpoint
        may return an anti-bot challenge. Google HTML search is used only
        for URL discovery. QAI itself still fetches, extracts, scores and
        ranks the discovered pages.
        """
        query = str(query or "").strip()
        if not query:
            return []

        encoded = urllib.parse.quote_plus(query)

        search_urls = [
            "https://www.google.com/search?q=" + encoded,
        ]

        urls = []
        seen = set()

        def add_url(raw_url):
            if not raw_url:
                return

            try:
                url = urllib.parse.unquote(str(raw_url).strip())
            except Exception:
                url = str(raw_url).strip()

            url = url.replace("&amp;", "&").strip()

            if not url.startswith(("http://", "https://")):
                return

            try:
                parsed = urllib.parse.urlparse(url)
            except Exception:
                return

            host = (parsed.netloc or "").lower().split(":")[0]

            if not host:
                return

            blocked_hosts = {
                "google.com",
                "www.google.com",
                "accounts.google.com",
                "support.google.com",
            }

            if host in blocked_hosts or host.endswith(".google.com"):
                return

            clean_url = urllib.parse.urlunparse(
                (
                    parsed.scheme,
                    parsed.netloc,
                    parsed.path,
                    parsed.params,
                    parsed.query,
                    "",
                )
            )

            if clean_url in seen:
                return

            seen.add(clean_url)
            urls.append(clean_url)

        for search_url in search_urls:
            try:
                html = self._http_get(search_url)
            except Exception as e:
                print(
                    "[WebResearch] Google discovery failed:",
                    type(e).__name__,
                    str(e),
                )
                continue

            if not html:
                continue

            lower_html = html.lower()

            # Google may return a consent/block page instead of results.
            if (
                "unusual traffic" in lower_html
                or "not a robot" in lower_html
                or "captcha" in lower_html
            ):
                print(
                    "[WebResearch] Google search challenge detected:",
                    search_url,
                )
                continue

            # Google result links commonly appear as:
            # <a href="https://example.com/...">
            # We deliberately inspect only absolute HTTP(S) links.
            absolute_pattern = r'<a[^>]+href=["\\\'](https?://[^"\\\']+)["\\\']'

            for raw_url in re.findall(
                absolute_pattern,
                html,
                flags=re.IGNORECASE,
            ):
                add_url(raw_url)

                if len(urls) >= self.MAX_WEB_RESULTS:
                    return urls[:self.MAX_WEB_RESULTS]

            # Additional fallback for links encoded inside Google HTML.
            href_pattern = r'href=["\\\']([^"\\\']+)["\\\']'

            for raw_url in re.findall(
                href_pattern,
                html,
                flags=re.IGNORECASE,
            ):
                if raw_url.startswith(("http://", "https://")):
                    add_url(raw_url)

                if len(urls) >= self.MAX_WEB_RESULTS:
                    return urls[:self.MAX_WEB_RESULTS]

        if not urls:
            print(
                "[WebResearch] No external result URLs discovered.",
                "engine=google",
            )

        return urls[:self.MAX_WEB_RESULTS]

    # =====================================================
    # PAGE EXTRACTION
    # =====================================================

    def _extract_page(self, url, html):

        parser = HTMLTextExtractor()

        try:
            parser.feed(html)
            parser.close()

        except Exception as e:

            print(
                "[WebResearch] HTML parse error:",
                type(e).__name__,
            )

        text = parser.text()
        title = parser.title()

        if not text:
            return None

        # Remove excessive boilerplate.
        text = re.sub(
            r"\s+",
            " ",
            text,
        ).strip()

        if len(text) < 80:
            return None

        return {
            "title": title or url,
            "url": url,
            "content": text[
                :self.MAX_PAGE_CHARS
            ],
        }

    def _discover_wikipedia_urls(self, query):
        """Discover direct Wikipedia articles for common multilingual subjects."""
        query = str(query or "").strip()

        if not query:
            return []

        normalized = self.normalize(query)

        # Remove common question prefixes.
        prefixes = (
            "ما هو ",
            "ما هي ",
            "ما معنى ",
            "ما المقصود ب",
            "what is ",
            "what are ",
            "who is ",
            "qu est ce que ",
            "qu est-ce que ",
            "qu'est-ce que ",
            "qui est ",
            "quelle est ",
            "quel est ",
            "qu'est ce que ",
        )

        subject = normalized

        for prefix in prefixes:
            if subject.startswith(prefix):
                subject = subject[len(prefix):].strip()
                break

        # Remove question marks.
        subject = subject.replace("؟", "").replace("?", "").strip()

        # Normalize common article wording.
        subject = re.sub(
            r"^(لغة|اللغة)\s+",
            "",
            subject,
        ).strip()

        # Normalize common aliases.
        subject_aliases = {
            "لغه python": "python",
            "لغة python": "python",
            "اللغة python": "python",
            "python language": "python",
            "python programming": "python",
            "بايثون": "python",
            "لغة بايثون": "python",
            "اللغة بايثون": "python",
            "intelligence artificielle": "artificial intelligence",
            "intelligence artificielle ia": "artificial intelligence",
            "ia": "artificial intelligence",
            "l intelligence artificielle": "artificial intelligence",
            "l'intelligence artificielle": "artificial intelligence",

            "qai": "qai",
            "quavron ai": "quavron ai",
            "كوافرون ai": "quavron ai",
            "كوافرون الذكاء الاصطناعي": "quavron ai",
        }

        subject = subject_aliases.get(subject, subject)

        # QAI is an internal Quavron entity.
        # It must be answered from QAI knowledge, not Wikipedia.
        if subject in {
            "qai",
            "quavron ai",
        }:
            return []

        # Known high-value concepts/entities.
        wikipedia_map = {
            "python": (
                "https://ar.wikipedia.org/wiki/بايثون_(لغة_برمجة)",
                "https://en.wikipedia.org/wiki/Python_(programming_language)",
                        ),

            "python programming language": (
                "https://ar.wikipedia.org/wiki/بايثون_(لغة_برمجة)",
                "https://en.wikipedia.org/wiki/Python_(programming_language)",
            ),

            "بايثون": (
                "https://ar.wikipedia.org/wiki/بايثون_(لغة_برمجة)",
                "https://en.wikipedia.org/wiki/Python_(programming_language)",
            ),

            "الذكاء الاصطناعي": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),

            "ذكاء اصطناعي": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),

            "artificial intelligence": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),

            "intelligence artificielle": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),
            "ia": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),
            "ai": (
                "https://ar.wikipedia.org/wiki/ذكاء_اصطناعي",
                "https://en.wikipedia.org/wiki/Artificial_intelligence",
            ),

            "machine learning": (
                "https://ar.wikipedia.org/wiki/تعلم_آلي",
                "https://en.wikipedia.org/wiki/Machine_learning",
            ),

            "تعلم الي": (
                "https://ar.wikipedia.org/wiki/تعلم_آلي",
                "https://en.wikipedia.org/wiki/Machine_learning",
            ),
        }

        candidates = wikipedia_map.get(subject)

        if candidates:
            return list(candidates)[:self.MAX_WEB_RESULTS]

        # Conservative generic fallback.
        clean_subject = re.sub(
            r"\s+",
            " ",
            subject,
        ).strip()

        if not clean_subject:
            return []

        encoded = urllib.parse.quote(
            clean_subject.replace(" ", "_"),
            safe="()_,-.",
        )

        return [
            "https://ar.wikipedia.org/wiki/" + encoded,
            "https://en.wikipedia.org/wiki/" + encoded,
        ][:self.MAX_WEB_RESULTS]

    # =====================================================
    # WEB SEARCH
    # =====================================================

    def web_search(
        self,
        query,
        limit=None,
    ):

        query = str(
            query or ""
        ).strip()

        if not query:
            return []

        if limit is None:
            limit = self.MAX_WEB_RESULTS

        # Discover normal web results first.
        urls = self._discover_urls(
            query
        )

        # Add direct Wikipedia candidates as a trusted research source.
        # This works even when a search engine challenge returns no URLs.
        wikipedia_urls = self._discover_wikipedia_urls(query)

        for wikipedia_url in wikipedia_urls:
            if wikipedia_url not in urls:
                urls.append(wikipedia_url)

        urls = urls[:self.MAX_WEB_RESULTS]

        results = []

        for url in urls[:limit]:

            html = self._http_get(
                url
            )

            if not html:
                continue

            page = self._extract_page(
                url,
                html,
            )

            if not page:
                continue

            page["source"] = "web"
            page["score"] = self._web_relevance(
                query,
                page,
            )
            page["relevance"] = page["score"]
            page["confidence"] = 0.0
            page["approved"] = False
            page["teacher"] = None
            page["question"] = query
            page["external"] = True

            results.append(page)

        results.sort(
            key=lambda x: (
                x.get(
                    "relevance",
                    0,
                ),
                x.get(
                    "score",
                    0,
                ),
            ),
            reverse=True,
        )

        return results[:limit]

    # =====================================================
    # WEB RELEVANCE
    # =====================================================

    def _web_relevance(
        self,
        query,
        page,
    ):
        """
        Rank web pages by semantic/query relevance.

        Ranking signals:
        - exact query phrase
        - title match
        - keyword coverage
        - early-content matches
        - question-style intent
        - penalties for weak/unrelated pages
        """

        query = str(query or "").strip()

        if not query:
            return 0

        keywords = self.extract_keywords(query)

        if not keywords:
            return 0

        title = str(
            page.get("title", "")
        ).strip()

        content = str(
            page.get("content", "")
        ).strip()

        normalized_query = self.normalize(query)
        normalized_title = self.normalize(title)
        normalized_content = self.normalize(content)

        # -------------------------------------------------
        # MULTILINGUAL CONCEPT MATCHING
        # -------------------------------------------------
        # Allow Arabic queries to match English sources and
        # English queries to match Arabic sources.
        concept_aliases = {
            "python": (
                "python",
                "بايثون",
                "لغة بايثون",
                "لغة python",
                "python programming language",
                "بايثون لغة برمجة",
        "langage python",
        "langage de programmation python",
        "python langage de programmation",
            ),
            "artificial_intelligence": (
                "ai",
                "artificial intelligence",
                "الذكاء الاصطناعي",
                "ذكاء اصطناعي",
                "الذكاء الصناعي",
            "intelligence artificielle",
            "intelligence artificielle ia",
            "ia",
            ),
            "machine_learning": (
                "machine learning",
                "تعلم آلي",
                "التعلم الآلي",
                "تعلم الي",
            "apprentissage automatique",
            "apprentissage machine",
            ),
        }

        query_concepts = set()

        for concept, aliases in concept_aliases.items():
            for alias in aliases:
                alias_normalized = self.normalize(alias)
                if (
                    alias_normalized
                    and alias_normalized in normalized_query
                ):
                    query_concepts.add(concept)
                    break

        page_concepts = set()

        page_text = (
            normalized_title
            + " "
            + normalized_content[:12000]
        )

        for concept, aliases in concept_aliases.items():
            for alias in aliases:
                alias_normalized = self.normalize(alias)
                if (
                    alias_normalized
                    and alias_normalized in page_text
                ):
                    page_concepts.add(concept)
                    break


        if not normalized_title and not normalized_content:
            return 0

        score = 0

        # Strong semantic match across Arabic / English aliases.
        concept_matches = query_concepts & page_concepts

        if concept_matches:
            score += 45 * len(concept_matches)


        # -------------------------------------------------
        # 1. Exact query phrase
        # -------------------------------------------------

        if normalized_query:
            if normalized_query in normalized_title:
                score += 55
            elif normalized_query in normalized_content[:5000]:
                score += 35
            elif normalized_query in (
                normalized_title + " " + normalized_content
            ):
                score += 20

        # -------------------------------------------------
        # 2. Keyword coverage
        # -------------------------------------------------

        title_matches = 0
        content_matches = 0

        for word in keywords:

            if word in normalized_title:
                title_matches += 1

            if word in normalized_content:
                content_matches += 1

        coverage = (
            content_matches
            / max(len(keywords), 1)
        )

        title_coverage = (
            title_matches
            / max(len(keywords), 1)
        )

        # -------------------------------------------------
        # 3. Title relevance
        # -------------------------------------------------

        score += title_matches * 25
        score += int(title_coverage * 30)

        # -------------------------------------------------
        # 4. Content coverage
        # -------------------------------------------------

        score += int(coverage * 35)

        # -------------------------------------------------
        # 5. Early-content relevance
        # -------------------------------------------------

        early_content = normalized_content[:4000]

        early_matches = 0

        for word in keywords:

            if word in early_content:
                early_matches += 1

        if keywords:
            early_coverage = (
                early_matches
                / max(len(keywords), 1)
            )

            score += int(
                early_coverage * 20
            )

        # -------------------------------------------------
        # 6. Question-intent boost
        # -------------------------------------------------

        question_markers = (
            "ما هو",
            "ما هي",
            "من هو",
            "من هي",
            "كيف",
            "لماذا",
            "ما معنى",
            "what is",
            "what are",
            "who is",
            "how",
            "why",
        )

        normalized_question_markers = [
            self.normalize(marker)
            for marker in question_markers
        ]

        is_question = any(
            marker in normalized_query
            for marker in normalized_question_markers
        )

        if is_question:

            # Pages whose title looks like an answer to the
            # question receive a moderate boost.
            if any(
                marker in normalized_title
                for marker in normalized_question_markers
            ):
                score += 12

        # -------------------------------------------------
        # 7. Weak coverage penalties
        # -------------------------------------------------

        if coverage == 0:
            # Cross-language semantic matches are valid even when
            # literal keyword coverage is zero.
            if not concept_matches:
                return 0
            score += 30

        if not concept_matches:
            if coverage < 0.34:
                score = int(score * 0.25)
            elif coverage < 0.50:
                score = int(score * 0.50)
            elif coverage < 0.67:
                score = int(score * 0.75)
        elif coverage < 0.67:
            score = int(score * 0.75)

        # -------------------------------------------------
        # 8. Title mismatch penalty
        # -------------------------------------------------

        # Do not penalize a page whose title matches the same
        # multilingual concept as the query.
        if (
            title_matches == 0
            and coverage < 0.67
            and not concept_matches
        ):
            score = int(score * 0.70)

        # -------------------------------------------------
        # 9. Very weak generic pages
        # -------------------------------------------------

        generic_titles = {
            "google",
            "home",
            "homepage",
            "calculator",
            "math calculator",
            "search",
        }

        if normalized_title in {
            self.normalize(value)
            for value in generic_titles
        }:
            score = int(score * 0.20)

        # -------------------------------------------------
        # 10. Final cap
        # -------------------------------------------------

        return max(
            0,
            min(score, 100),
        )

    # =====================================================
    # UNIFIED SEARCH
    # =====================================================

    def search(
        self,
        keyword,
        external=True,
        local=True,
    ):

        keyword = str(
            keyword or ""
        ).strip()

        if not keyword:
            return []

        results = []

        # -------------------------------------------------
        # 1. Official local knowledge
        # -------------------------------------------------

        if local:

            results.extend(
                self._local_search(
                    keyword
                )
            )

        # -------------------------------------------------
        # 2. External Web Research
        # -------------------------------------------------

        if external:

            try:

                results.extend(
                    self.web_search(
                        keyword
                    )
                )

            except Exception as e:

                print(
                    "[WebResearch] Search error:",
                    type(e).__name__,
                    str(e),
                )

        # -------------------------------------------------
        # Ranking
        # -------------------------------------------------

        for item in results:

            source = str(
                item.get("source", "")
                or ""
            ).strip().lower()

            relevance = float(
                item.get(
                    "relevance",
                    item.get("score", 0),
                )
                or 0
            )

            raw_score = float(
                item.get(
                    "score",
                    0,
                )
                or 0
            )

            confidence = float(
                item.get(
                    "confidence",
                    0,
                )
                or 0
            )

            approved = bool(
                item.get(
                    "approved",
                    False,
                )
            )

            external_item = bool(
                item.get(
                    "external",
                    source == "web",
                )
            )

            # -------------------------------------------------
            # Source trust
            # -------------------------------------------------

            if source == "knowledge" and approved:
                source_bonus = 600

            elif source == "knowledge":
                source_bonus = 400

            elif source == "web":
                source_bonus = 100

            else:
                source_bonus = self.SOURCE_PRIORITY.get(
                    source,
                    0,
                )

            # -------------------------------------------------
            # Knowledge confidence
            # -------------------------------------------------

            if source == "knowledge":

                confidence_bonus = int(
                    max(0.0, min(confidence, 1.0))
                    * 200
                )

                if approved:
                    confidence_bonus += 100

            else:
                confidence_bonus = 0

            # -------------------------------------------------
            # External penalty
            # -------------------------------------------------

            external_penalty = 0

            if external_item and source == "web":

                # Web pages are research evidence,
                # not trusted internal knowledge.
                external_penalty = 50

                # Very weak web relevance should be strongly
                # suppressed.
                if relevance < 30:
                    external_penalty += 150

                elif relevance < 50:
                    external_penalty += 75

            # -------------------------------------------------
            # Final score
            # -------------------------------------------------

            item["final_score"] = (
                source_bonus
                + int(relevance * 8)
                + int(raw_score * 0.5)
                + confidence_bonus
                - external_penalty
            )

            # Keep ranking metadata explicit.
            item["ranking_source"] = source
            item["ranking_relevance"] = relevance
            item["ranking_confidence"] = confidence
            item["ranking_approved"] = approved

        results.sort(
            key=lambda x: (
                float(
                    x.get(
                        "final_score",
                        0,
                    )
                    or 0
                ),
                float(
                    x.get(
                        "relevance",
                        0,
                    )
                    or 0
                ),
            ),
            reverse=True,
        )

        # -------------------------------------------------
        # Deduplicate
        # -------------------------------------------------

        cleaned = []
        seen = set()

        for item in results:

            fingerprint = (
                item.get(
                    "url",
                    ""
                )
                or str(
                    item.get(
                        "text",
                        item.get(
                            "value",
                            "",
                        ),
                    )
                )[:500]
            )

            if fingerprint in seen:
                continue

            seen.add(fingerprint)
            cleaned.append(item)

        return cleaned[:12]


search_engine = KnowledgeSearch()

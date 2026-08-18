import requests
import time
import re
import sys

URL = "http://127.0.0.1:8000/api/chat"
USER = "qai-readiness-test"

cases = [
    {
        "name": "KNOWN / ENGLISH",
        "message": "What is artificial intelligence?",
        "kind": "known",
    },
    {
        "name": "KNOWN / ARABIC",
        "message": "ما هو الذكاء الاصطناعي؟",
        "kind": "known",
    },
    {
        "name": "KNOWN / MULTILINGUAL",
        "message": "What is Artificial Intelligence? Qu'est-ce que l'intelligence artificielle ?",
        "kind": "known",
    },
    {
        "name": "RESEARCH / UNKNOWN",
        "message": "What is the latest information about a completely unknown QAI research topic?",
        "kind": "research",
    },
    {
        "name": "UNKNOWN / UNTRUSTED",
        "message": "QAI_RANDOM_UNKNOWN_ENTITY_918273645",
        "kind": "unknown",
    },
]

print("=" * 80)
print("QAI GENERAL PRODUCTION READINESS TEST")
print("=" * 80)
print("URL:", URL)
print("USER:", USER)
print()

# ------------------------------------------------------------
# 1. SERVER
# ------------------------------------------------------------

server_ok = False

print("=" * 80)
print("1. SERVER / API AVAILABILITY")
print("=" * 80)

try:
    r = requests.get(
        "http://127.0.0.1:8000/api/status",
        timeout=10,
    )

    print("HTTP:", r.status_code)
    print("BODY:", r.text[:300])

    server_ok = r.status_code == 200

except Exception as exc:
    print("SERVER ERROR:", repr(exc))

print("SERVER:", "PASS" if server_ok else "FAIL")
print()

if not server_ok:
    print("QAI READINESS: FAIL")
    sys.exit(1)

# ------------------------------------------------------------
# 2. API CASES
# ------------------------------------------------------------

results = []
passed = 0
failed = 0

for index, case in enumerate(cases, 1):

    name = case["name"]
    message = case["message"]
    kind = case["kind"]

    print("=" * 80)
    print(f"CASE {index}: {name}")
    print("=" * 80)
    print("QUESTION:", message)

    started = time.time()

    try:
        response = requests.post(
            URL,
            json={
                "user_id": USER,
                "message": message,
            },
            timeout=180,
        )

        elapsed = time.time() - started

        try:
            data = response.json()
        except Exception:
            data = {}

        provider = data.get("provider")
        source = data.get("source")
        documents = data.get("documents")
        research_used = data.get("research_used")
        evidence = data.get("research_evidence_count")
        generation_provider = data.get("generation_provider")
        generation_source = data.get("generation_source")
        reply = str(data.get("reply", "") or "").strip()

        print("HTTP:", response.status_code)
        print("TIME:", f"{elapsed:.2f}s")
        print("provider:", provider)
        print("source:", source)
        print("documents:", documents)
        print("research_used:", research_used)
        print("research_evidence_count:", evidence)
        print("generation_provider:", generation_provider)
        print("generation_source:", generation_source)
        print("reply:", reply[:300])

        # ----------------------------------------------------
        # BASIC API CONTRACT
        # ----------------------------------------------------

        ok = True
        reasons = []

        if response.status_code != 200:
            ok = False
            reasons.append("HTTP != 200")

        if provider != "local":
            ok = False
            reasons.append("provider != local")

        if generation_provider != "local":
            ok = False
            reasons.append("generation_provider != local")

        if not reply:
            ok = False
            reasons.append("empty reply")

        # ----------------------------------------------------
        # PUBLIC ANSWER CLEANUP
        # ----------------------------------------------------

        leaked_patterns = [
            r"QAI\s+RESEARCH\s+EVIDENCE",
            r"source\s*=",
            r"title\s*=",
            r"url\s*=",
            r"content\s*=",
            r"snippet\s*=",
            r"stored_question\s*=",
            r"final_score\s*=",
            r"relevance\s*=",
            r"approved\s*=",
            r"confidence\s*=",
        ]

        leaks = []

        for pattern in leaked_patterns:
            if re.search(pattern, reply, re.IGNORECASE):
                leaks.append(pattern)

        if leaks:
            ok = False
            reasons.append("metadata leaked: " + ", ".join(leaks))

        # ----------------------------------------------------
        # KNOWN KNOWLEDGE
        # ----------------------------------------------------

        if kind == "known":

            if not documents or int(documents or 0) < 1:
                ok = False
                reasons.append("known question returned no documents")

            if source not in (
                "local",
                "local_knowledge",
                "rag",
                "knowledge",
            ):
                print("NOTE: known source =", source)

        # ----------------------------------------------------
        # RESEARCH
        # ----------------------------------------------------

        if kind == "research":

            if research_used is not True:
                ok = False
                reasons.append("research_used != True")

            if generation_source not in (
                "research",
                "local_research",
            ):
                ok = False
                reasons.append(
                    f"unexpected research generation source: {generation_source}"
                )

            # Research may legitimately return zero evidence.
            # In that case QAI must refuse safely rather than hallucinate.
            if int(evidence or 0) == 0:

                safe_refusal = (
                    "enough trusted evidence" in reply.lower()
                    or "reliable factual answer" in reply.lower()
                    or "معلومات موثوقة" in reply
                    or "أدلة" in reply
                )

                if not safe_refusal:
                    ok = False
                    reasons.append(
                        "zero research evidence but no safe refusal"
                    )

        # ----------------------------------------------------
        # UNKNOWN
        # ----------------------------------------------------

        if kind == "unknown":

            if not reply:
                ok = False
                reasons.append("unknown query produced empty answer")

            # Unknown must not expose internal metadata.
            # It is acceptable for QAI to refuse.
            if leaks:
                ok = False
                reasons.append("unknown response leaked metadata")

        status = "PASS" if ok else "FAIL"

        print("STATUS:", status)

        if reasons:
            print("REASONS:")
            for reason in reasons:
                print(" -", reason)

        results.append(
            {
                "name": name,
                "status": status,
                "time": elapsed,
                "source": source,
                "research_used": research_used,
                "evidence": evidence,
                "generation_source": generation_source,
                "reply": reply[:120],
            }
        )

        if ok:
            passed += 1
        else:
            failed += 1

    except Exception as exc:

        elapsed = time.time() - started

        print("STATUS: FAIL")
        print("ERROR:", repr(exc))

        results.append(
            {
                "name": name,
                "status": "FAIL",
                "time": elapsed,
                "source": None,
                "research_used": None,
                "evidence": None,
                "generation_source": None,
                "reply": "",
            }
        )

        failed += 1

    print()

# ------------------------------------------------------------
# 3. FINAL
# ------------------------------------------------------------

print("=" * 80)
print("FINAL QAI READINESS RESULT")
print("=" * 80)

print("SERVER:", "PASS" if server_ok else "FAIL")
print("API CASES PASS:", passed)
print("API CASES FAIL:", failed)

print()
print("CASE SUMMARY")

for item in results:

    print(
        f"{item['status']:4} | "
        f"{item['name']:<25} | "
        f"{item.get('time', 0):6.2f}s | "
        f"source={item.get('source')} | "
        f"research={item.get('research_used')} | "
        f"evidence={item.get('evidence')} | "
        f"generation={item.get('generation_source')}"
    )

print()
print("=" * 80)

if server_ok and failed == 0:

    print("QAI PRODUCTION READINESS: PASS")
    print("QAI API IS READY FOR WEBSITE INTEGRATION")

else:

    print("QAI PRODUCTION READINESS: FAIL")
    print("QAI STILL NEEDS FIXES BEFORE WEBSITE INTEGRATION")

print("=" * 80)

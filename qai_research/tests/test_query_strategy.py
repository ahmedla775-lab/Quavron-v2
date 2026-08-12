from qai_research.core.query_strategy import query_strategy


def run(query, language=None):
    print()
    print("=" * 70)
    print("QUERY:", query)

    variants = query_strategy.build(
        query=query,
        language=language,
    )

    print("VARIANTS:", len(variants))

    for item in variants:
        print(
            f"{item.priority}. "
            f"[{item.purpose}] "
            f"[{item.language}] "
            f"{item.query}"
        )


def main():
    run(
        "Quavron",
        "auto",
    )

    run(
        "Quavron SARL Algeria",
        "auto",
    )

    run(
        "الذكاء الاصطناعي",
        "ar",
    )

    run(
        "Python",
        "en",
    )


if __name__ == "__main__":
    main()

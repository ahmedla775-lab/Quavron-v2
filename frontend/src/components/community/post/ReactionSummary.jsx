import { REACTIONS } from "../../../modules/community/constants/reactions";

export default function ReactionSummary({
  counts = {},
}) {
  const reactions = REACTIONS.filter(
    (reaction) => (counts[reaction.type] ?? 0) > 0
  );

  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total === 0) return null;

  return (
    <div
      className="
        mt-3
        flex
        items-center
        justify-between
        text-sm
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-[var(--q-muted)]
        "
      >
        <div className="flex -space-x-1">
          {reactions.slice(0, 3).map((reaction) => (
            <span
              key={reaction.type}
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border-2
                border-[var(--q-card)]
                bg-[var(--q-surface)]
                text-sm
              "
            >
              {reaction.emoji}
            </span>
          ))}
        </div>

        <span>
          {total} {total === 1 ? "Reaction" : "Reactions"}
        </span>
      </div>

      <div
        className="
          text-[var(--q-muted)]
        "
      >
        {reactions.map((reaction) => (
          <span
            key={reaction.type}
            className="ml-3"
          >
            {reaction.emoji} {counts[reaction.type]}
          </span>
        ))}
      </div>
    </div>
  );
}

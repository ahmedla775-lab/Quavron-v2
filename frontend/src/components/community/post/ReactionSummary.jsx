import { REACTIONS } from "../../../modules/community/constants/reactions";

export default function ReactionSummary({
  counts = {},
}) {
  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">

      {REACTIONS.map((reaction) => {
        const count = counts[reaction.type] ?? 0;

        if (count === 0) {
          return null;
        }

        return (
          <div
            key={reaction.type}
            className="
              flex
              items-center
              gap-1
              rounded-full
              border
              border-slate-700
              bg-slate-800
              px-2
              py-1
            "
          >
            <span>{reaction.emoji}</span>

            <span>{count}</span>
          </div>
        );
      })}

      <span className="ml-auto text-xs text-slate-500">
        {total} Reactions
      </span>

    </div>
  );
}

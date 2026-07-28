import { REACTIONS } from "../../../modules/community/constants/reactions";

export default function ReactionSummary({ counts = {} }) {
  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total === 0) return null;

  const active = REACTIONS.filter(
    (reaction) => (counts[reaction.type] ?? 0) > 0
  );

  return (
    <div className="mt-3 flex items-center justify-between">

      <div className="flex items-center -space-x-2">
        {active.slice(0, 3).map((reaction) => (
          <div
            key={reaction.type}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border-2
              border-slate-900
              bg-slate-800
              text-lg
            "
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      <span className="text-sm text-slate-400">
        {total} Reactions
      </span>

    </div>
  );
}

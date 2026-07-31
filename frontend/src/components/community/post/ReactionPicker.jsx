import { REACTIONS } from "../../../modules/community/constants/reactions";

export default function ReactionPicker({
  visible,
  onSelect,
}) {
  if (!visible) return null;

  return (
    <div
      className="
        absolute
        bottom-full
        left-0
        mb-3
        z-50
        flex
        items-center
        gap-2
        rounded-full
        border
        border-[var(--q-border)]
        bg-[var(--q-surface)]
        px-3
        py-2
        shadow-2xl
        backdrop-blur
      "
    >
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          title={reaction.label}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            text-2xl
            transition-all
            duration-200
            hover:scale-125
            hover:bg-[var(--q-card)]
            active:scale-110
          "
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
}

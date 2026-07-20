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
        bottom-14
        left-0
        z-50
        flex
        items-center
        gap-2
        rounded-full
        border
        border-slate-700
        bg-slate-900
        px-3
        py-2
        shadow-2xl
      "
    >
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          className="
            text-2xl
            transition
            hover:scale-125
          "
          title={reaction.label}
        >
{reaction.emoji}   
        </button>
      ))}
    </div>
  );
}

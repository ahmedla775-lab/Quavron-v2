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
right-0
z-[9999]

mx-auto
w-[95vw]
max-w-[420px]

overflow-x-auto
overflow-y-hidden

rounded-full
border
border-slate-700
bg-slate-900/95
backdrop-blur

px-3
py-2

flex
flex-nowrap
gap-2

shadow-2xl
scrollbar-hide
"
    >
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => onSelect(reaction.type)}
          title={reaction.label}
          className="
flex-shrink-0
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
hover:bg-slate-800
"
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );
}

const platforms = [
  "All",
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "X",
  "Snapchat",
];

export default function PlatformTabs({
  selected,
  onSelect,
}) {
  return (
    <div
      className="
        sticky
        top-0
        z-10
        border-b
        border-slate-800
        bg-slate-950
      "
    >
      <div
        className="
          flex
          gap-2
          overflow-x-auto
          px-3
          py-3
          scrollbar-none
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {platforms.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`
              shrink-0
              rounded-full
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              ${
                selected === item
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

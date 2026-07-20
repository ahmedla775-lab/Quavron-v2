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
        z-20
        flex
        w-full
        min-w-0
        gap-2
        overflow-x-auto
        border-b
        border-slate-800
        bg-slate-950
        p-2
        sm:p-3
      "
    >

      {platforms.map((item) => (

        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`
            shrink-0
            whitespace-nowrap
            rounded-full
            px-4
            py-2
            transition

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

  );

}

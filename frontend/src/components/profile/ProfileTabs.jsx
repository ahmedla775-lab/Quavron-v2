const tabs = [
  "Posts",
  "Media",
  "Projects",
  "Reels",
  "Stories",
  "Activity",
  "About",
  "Saved",
];

export default function ProfileTabs({
  activeTab,
  onChange,
}) {

  return (

    <div className="mt-8 overflow-x-auto">

      <div className="flex gap-2 min-w-max">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-5 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >

            {tab}

          </button>

        ))}

      </div>

    </div>

  );

}

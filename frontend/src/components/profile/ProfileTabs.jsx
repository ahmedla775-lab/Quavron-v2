const tabs = [
  "Posts",
  "Projects",
  "Media",
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

      <div className="flex min-w-max gap-3 border-b border-slate-800 pb-3">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
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

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

      <div className="flex min-w-max gap-3 border-b border-[var(--q-border)] pb-3">

        {tabs.map((tab) => (

          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-[var(--q-surface)] text-[var(--q-muted)] hover:bg-[var(--q-card)] hover:text-[var(--q-text)]"
            }`}
          >

            {tab}

          </button>

        ))}

      </div>

    </div>

  );

}

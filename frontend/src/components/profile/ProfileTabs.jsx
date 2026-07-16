export default function ProfileTabs({

  activeTab,

  onChange,

}) {

  const tabs = [

    "Posts",

    "Media",

    "Saved",

    "About",

  ];

  return (

    <div className="mt-8 border-b border-slate-800">

      <div className="flex flex-wrap gap-2">

        {tabs.map((tab) => (

          <button

            key={tab}

            onClick={() => onChange(tab)}

            className={`rounded-t-xl px-5 py-3 font-medium transition ${
              activeTab === tab
                ? "bg-sky-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}

          >

            {tab}

          </button>

        ))}

      </div>

    </div>

  );

}

import {
  FileText,
  Image,
  Bookmark,
  Info,
} from "lucide-react";

export default function ProfileTabs({

  activeTab,

  onChange,

  profile,

  mediaCount = 0,

}) {

  const tabs = [

    {
      id: "Posts",
      label: "Posts",
      icon: <FileText size={18} />,
      count: profile?.posts_count || 0,
    },

    {
      id: "Media",
      label: "Media",
      icon: <Image size={18} />,
      count: mediaCount,
    },

    {
      id: "Saved",
      label: "Saved",
      icon: <Bookmark size={18} />,
      count: null,
    },

    {
      id: "About",
      label: "About",
      icon: <Info size={18} />,
      count: null,
    },

  ];

  return (

    <div className="mt-8 overflow-x-auto">

      <div className="flex min-w-max gap-3 border-b border-slate-800 pb-2">

        {tabs.map((tab) => {

          const active =
            activeTab === tab.id;

          return (

            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 transition-all ${
                active
                  ? "bg-sky-600 text-white shadow-lg"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >

              {tab.icon}

              <span className="font-medium">

                {tab.label}

              </span>

              {tab.count !== null && (

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >

                  {tab.count}

                </span>

              )}

            </button>

          );

        })}

      </div>

    </div>

  );

}

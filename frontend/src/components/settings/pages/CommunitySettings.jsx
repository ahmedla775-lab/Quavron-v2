import { useState } from "react";

export default function CommunitySettings() {

  const [settings, setSettings] = useState({

    allowMessages: true,

    allowComments: true,

    allowMentions: true,

    allowTags: true,

    showFollowers: true,

    showFollowing: true,

    allowShares: true,

    allowReposts: true,

    matureContent: false,

    autoTranslate: true,

    communityRecommendations: true,

    onlineStatus: true,

  });

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Community

      </h1>

      <p className="mt-2 text-slate-400">

        Manage your Community experience.

      </p>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900">

        <Section
          title="Interactions"
          items={[
            ["Allow Messages","allowMessages"],
            ["Allow Comments","allowComments"],
            ["Allow Mentions","allowMentions"],
            ["Allow Tags","allowTags"],
            ["Allow Shares","allowShares"],
            ["Allow Reposts","allowReposts"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Profile"
          items={[
            ["Show Followers","showFollowers"],
            ["Show Following","showFollowing"],
            ["Show Online Status","onlineStatus"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Content"
          items={[
            ["Show Mature Content","matureContent"],
            ["Automatic Translation","autoTranslate"],
            ["Community Recommendations","communityRecommendations"],
          ]}
          settings={settings}
          toggle={toggle}
        />

      </div>

      <div className="mt-10 flex justify-end">

        <button
          className="
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
          "
        >

          Save Changes

        </button>

      </div>

    </div>

  );

}

function Section({

  title,

  items,

  settings,

  toggle,

}){

  return(

    <div>

      <div className="border-b border-slate-800 p-5">

        <h2 className="text-xl font-semibold text-white">

          {title}

        </h2>

      </div>

      {items.map(([label,key])=>(

        <div
          key={key}
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            p-5
            last:border-0
          "
        >

          <span className="text-white">

            {label}

          </span>

          <button
            onClick={()=>toggle(key)}
            className={`rounded-full px-5 py-2 font-semibold ${
              settings[key]
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-white"
            }`}
          >

            {settings[key] ? "ON" : "OFF"}

          </button>

        </div>

      ))}

    </div>

  );

}

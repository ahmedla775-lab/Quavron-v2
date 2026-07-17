import { useState } from "react";

export default function PrivacySettings() {

  const [settings, setSettings] = useState({

    privateProfile: false,

    showEmail: false,

    showLocation: true,

    allowMessages: true,

    searchable: true,

    showFollowers: true,

    showFollowing: true,

    showActivity: true,

  });

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  function Row({ title, description, value, onChange }) {

    return (

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5">

        <div>

          <h3 className="font-semibold text-white">

            {title}

          </h3>

          <p className="mt-1 text-sm text-slate-400">

            {description}

          </p>

        </div>

        <button
          onClick={onChange}
          className={`h-7 w-14 rounded-full transition ${
            value
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >

          <div
            className={`h-6 w-6 rounded-full bg-white transition ${
              value
                ? "translate-x-7"
                : "translate-x-1"
            }`}
          />

        </button>

      </div>

    );

  }

  return (

    <div className="space-y-5">

      <Row
        title="Private Profile"
        description="Only approved followers can view your profile."
        value={settings.privateProfile}
        onChange={() => toggle("privateProfile")}
      />

      <Row
        title="Show Email"
        description="Display your email on your public profile."
        value={settings.showEmail}
        onChange={() => toggle("showEmail")}
      />

      <Row
        title="Show Location"
        description="Display your location."
        value={settings.showLocation}
        onChange={() => toggle("showLocation")}
      />

      <Row
        title="Allow Direct Messages"
        description="Anyone can send you messages."
        value={settings.allowMessages}
        onChange={() => toggle("allowMessages")}
      />

      <Row
        title="Search Engine Indexing"
        description="Allow search engines to index your profile."
        value={settings.searchable}
        onChange={() => toggle("searchable")}
      />

      <Row
        title="Show Followers"
        description="Display followers count publicly."
        value={settings.showFollowers}
        onChange={() => toggle("showFollowers")}
      />

      <Row
        title="Show Following"
        description="Display following count publicly."
        value={settings.showFollowing}
        onChange={() => toggle("showFollowing")}
      />

      <Row
        title="Show Activity"
        description="Display your recent activity."
        value={settings.showActivity}
        onChange={() => toggle("showActivity")}
      />

    </div>

  );

}

import { useState } from "react";

export default function PrivacySettings() {

  const [settings, setSettings] = useState({

    profileVisibility: "public",

    messagePermission: "everyone",

    commentsPermission: "everyone",

    showEmail: false,

    showPhone: false,

    searchable: true,

    activityStatus: true,

    tagPermission: "everyone",

    followersList: true,

    onlineStatus: true,

  });

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  function update(key, value) {

    setSettings((prev) => ({

      ...prev,

      [key]: value,

    }));

  }

  function save() {

    alert("سيتم ربط إعدادات الخصوصية مع Supabase.");

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Privacy

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Control who can see your information and interact with you.

      </p>

      <div className="mt-10 space-y-8">

        <SelectCard
          title="Profile Visibility"
          value={settings.profileVisibility}
          onChange={(v)=>update("profileVisibility",v)}
          options={[
            "public",
            "followers",
            "private",
          ]}
        />

        <SelectCard
          title="Who Can Send Messages"
          value={settings.messagePermission}
          onChange={(v)=>update("messagePermission",v)}
          options={[
            "everyone",
            "followers",
            "nobody",
          ]}
        />

        <SelectCard
          title="Who Can Comment"
          value={settings.commentsPermission}
          onChange={(v)=>update("commentsPermission",v)}
          options={[
            "everyone",
            "followers",
            "nobody",
          ]}
        />

        <SelectCard
          title="Who Can Tag You"
          value={settings.tagPermission}
          onChange={(v)=>update("tagPermission",v)}
          options={[
            "everyone",
            "followers",
            "nobody",
          ]}
        />

        <SwitchCard
          title="Appear in Search Results"
          value={settings.searchable}
          onClick={()=>toggle("searchable")}
        />

        <SwitchCard
          title="Show Email Address"
          value={settings.showEmail}
          onClick={()=>toggle("showEmail")}
        />

        <SwitchCard
          title="Show Phone Number"
          value={settings.showPhone}
          onClick={()=>toggle("showPhone")}
        />

        <SwitchCard
          title="Show Followers List"
          value={settings.followersList}
          onClick={()=>toggle("followersList")}
        />

        <SwitchCard
          title="Show Active Status"
          value={settings.activityStatus}
          onClick={()=>toggle("activityStatus")}
        />

        <SwitchCard
          title="Show Online Status"
          value={settings.onlineStatus}
          onClick={()=>toggle("onlineStatus")}
        />

      </div>

      <div className="mt-10 flex justify-start md:justify-between">

        <button className="rounded-xl bg-slate-700 px-3 md:px-6 py-3 text-[var(--q-text)]">

          Download My Data

        </button>

        <button
          onClick={save}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-[var(--q-text)]"
        >

          Save Changes

        </button>

      </div>

      <div className="mt-14 rounded-2xl border border-red-600 bg-red-950/30 p-3 md:p-6">

        <h2 className="text-xl font-bold text-red-400">

          Danger Zone

        </h2>

        <p className="mt-2 text-[var(--q-text)]">

          Permanently delete your account and all associated data.

        </p>

        <button className="mt-5 rounded-xl bg-red-600 px-3 md:px-6 py-3 font-semibold text-[var(--q-text)]">

          Delete Account

        </button>

      </div>

    </div>

  );

}

function SwitchCard({

  title,

  value,

  onClick,

}){

  return(

    <div className="flex items-center justify-start md:justify-between rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <span className="font-medium text-[var(--q-text)]">

        {title}

      </span>

      <button
        onClick={onClick}
        className={`rounded-full px-5 py-2 font-semibold ${
          value
            ? "bg-green-600 text-[var(--q-text)]"
            : "bg-slate-700 text-[var(--q-text)]"
        }`}
      >

        {value ? "ON" : "OFF"}

      </button>

    </div>

  );

}

function SelectCard({

  title,

  value,

  onChange,

  options,

}){

  return(

    <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <label className="mb-3 block font-medium text-[var(--q-text)]">

        {title}

      </label>

      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--q-border)] bg-[var(--q-card)] p-3 text-[var(--q-text)]"
      >

        {options.map((item)=>(

          <option
            key={item}
            value={item}
          >

            {item}

          </option>

        ))}

      </select>

    </div>

  );

}

import { useState } from "react";

export default function ProfileSettings() {

  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    bio: "",
    website: "",
    location: "",
    birthday: "",
    gender: "",
  });

  function update(field, value) {

    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));

  }

  function saveProfile() {

    alert("سيتم ربط الصفحة مع قاعدة البيانات لاحقًا.");

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Profile

      </h1>

      <p className="mt-2 text-slate-400">

        Customize how people see your Quavron profile.

      </p>

      <div className="mt-10 space-y-10">

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Profile Photo

          </h2>

          <div className="flex items-center gap-6">

            <div className="h-28 w-28 rounded-full bg-slate-800" />

            <div className="space-y-3">

              <button className="rounded-xl bg-blue-600 px-5 py-2 text-white">

                Upload Photo

              </button>

              <button className="rounded-xl bg-slate-800 px-5 py-2 text-white">

                Remove

              </button>

            </div>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Cover Photo

          </h2>

          <div className="h-52 rounded-2xl border border-dashed border-slate-700 bg-slate-900 flex items-center justify-center">

            <button className="rounded-xl bg-blue-600 px-6 py-3 text-white">

              Upload Cover

            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Public Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <Input
              label="Display Name"
              value={profile.displayName}
              onChange={(v)=>update("displayName",v)}
            />

            <Input
              label="Username"
              value={profile.username}
              onChange={(v)=>update("username",v)}
            />

            <Input
              label="Website"
              value={profile.website}
              onChange={(v)=>update("website",v)}
            />

            <Input
              label="Location"
              value={profile.location}
              onChange={(v)=>update("location",v)}
            />

            <Input
              label="Birthday"
              type="date"
              value={profile.birthday}
              onChange={(v)=>update("birthday",v)}
            />

            <Input
              label="Gender"
              value={profile.gender}
              onChange={(v)=>update("gender",v)}
            />

          </div>

          <div className="mt-6">

            <label className="mb-2 block text-slate-400">

              Bio

            </label>

            <textarea
              rows={6}
              value={profile.bio}
              onChange={(e)=>update("bio",e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
            />

          </div>

        </section>

        <div className="flex justify-end">

          <button
            onClick={saveProfile}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white"
          >

            Save Profile

          </button>

        </div>

      </div>

    </div>

  );

}

function Input({

  label,
  value,
  onChange,
  type="text",

}){

  return(

    <div>

      <label className="mb-2 block text-slate-400">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
      />

    </div>

  );

}

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

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Profile

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Customize how people see your Quavron profile.

      </p>

      <div className="mt-10 space-y-10">

        <section>

          <h2 className="mb-5 text-xl font-semibold text-[var(--q-text)]">

            Profile Photo

          </h2>

          <div className="flex items-center gap-3">

            <div className="h-28 w-28 rounded-full bg-[var(--q-card)]" />

            <div className="space-y-3">

              <button className="rounded-xl bg-blue-600 px-5 py-2 text-[var(--q-text)]">

                Upload Photo

              </button>

              <button className="rounded-xl bg-[var(--q-card)] px-5 py-2 text-[var(--q-text)]">

                Remove

              </button>

            </div>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-[var(--q-text)]">

            Cover Photo

          </h2>

          <div className="h-52 rounded-2xl border border-dashed border-[var(--q-border)] bg-[var(--q-surface)] flex items-center justify-center">

            <button className="rounded-xl bg-blue-600 px-3 md:px-6 py-3 text-[var(--q-text)]">

              Upload Cover

            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-[var(--q-text)]">

            Public Information

          </h2>

          <div className="grid gap-3 md:grid-cols-2">

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

            <label className="mb-2 block text-[var(--q-muted)]">

              Bio

            </label>

            <textarea
              rows={6}
              value={profile.bio}
              onChange={(e)=>update("bio",e.target.value)}
              className="w-full rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 text-[var(--q-text)]"
            />

          </div>

        </section>

        <div className="flex justify-end">

          <button
            onClick={saveProfile}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-[var(--q-text)]"
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

      <label className="mb-2 block text-[var(--q-muted)]">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 text-[var(--q-text)]"
      />

    </div>

  );

}

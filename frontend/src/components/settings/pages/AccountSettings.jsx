import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthProvider";

export default function AccountSettings() {

  const { user } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    bio: "",
  });

  useEffect(() => {

    if (!user) return;

    setForm({

      fullName:
        user.user_metadata?.full_name || "",

      username:
        user.user_metadata?.username || "",

      email:
        user.email || "",

      phone:
        user.user_metadata?.phone || "",

      website:
        user.user_metadata?.website || "",

      location:
        user.user_metadata?.location || "",

      bio:
        user.user_metadata?.bio || "",

    });

  }, [user]);

  function update(key, value) {

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  }

  function save() {

    alert(
      "سيتم ربط هذه الصفحة مع Supabase في المرحلة القادمة."
    );

  }

  return (

    <div className="mx-auto max-w-4xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Personal Details

      </h1>

      <p className="mt-2 text-slate-400">

        Manage your account information.

      </p>

      <div className="mt-10 space-y-8">

        <section>

          <h2 className="mb-4 text-lg font-semibold text-white">

            Basic Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <Field
              label="Full Name"
              value={form.fullName}
              onChange={(v) => update("fullName", v)}
            />

            <Field
              label="Username"
              value={form.username}
              onChange={(v) => update("username", v)}
            />

            <Field
              label="Email"
              value={form.email}
              onChange={(v) => update("email", v)}
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => update("phone", v)}
            />

          </div>

        </section>

        <section>

          <h2 className="mb-4 text-lg font-semibold text-white">

            Public Information

          </h2>

          <div className="space-y-6">

            <Field
              label="Website"
              value={form.website}
              onChange={(v) => update("website", v)}
            />

            <Field
              label="Location"
              value={form.location}
              onChange={(v) => update("location", v)}
            />

            <div>

              <label className="mb-2 block text-sm text-slate-400">

                Bio

              </label>

              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) =>
                  update("bio", e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-900
                  p-3
                  text-white
                  outline-none
                  focus:border-blue-500
                "
              />

            </div>

          </div>

        </section>

      </div>

      <div className="mt-10 flex justify-end">

        <button
          onClick={save}
          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >

          Save Changes

        </button>

      </div>

    </div>

  );

}

function Field({
  label,
  value,
  onChange,
}) {

  return (

    <div>

      <label className="mb-2 block text-sm text-slate-400">

        {label}

      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          p-3
          text-white
          outline-none
          focus:border-blue-500
        "
      />

    </div>

  );

}

import { useState, useEffect } from "react";
import { useProfile } from "../../../context/ProfileContext";
import ImageUploader from "../../profile/ImageUploader";

export default function AccountSettings() {
  const { profile, saveProfile, updateAvatar, updateCover } = useProfile();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    bio: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    setForm({
      fullName: profile.full_name || "",
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      website: profile.website || "",
      location: profile.location || "",
      bio: profile.bio || "",
    });
  }, [profile]);

  function update(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function save() {
    try {
      setSaving(true);

      await saveProfile({
        full_name: form.fullName,
        username: form.username,
        phone: form.phone,
        website: form.website,
        location: form.location,
        bio: form.bio,
      });

      
localStorage.setItem(
  "profile",
  JSON.stringify({
    ...profile,
    ...form,
  })
);

setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage(error.message);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-xl md:text-3xl font-bold text-[var(--q-text)]">
        Personal Details
      </h1>

      <p className="mt-2 text-[var(--q-muted)]">
        Manage your account information.
      </p>

      <section className="mt-10 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-5">

        <h2 className="mb-5 text-lg font-semibold text-[var(--q-text)]">
          Profile Images
        </h2>

        <div className="flex flex-col gap-6 md:flex-row">

          <div className="relative">
            <img
              src={
                profile?.avatar_url ||
                "https://ui-avatars.com/api/?name=Q"
              }
              className="h-28 w-28 rounded-full object-cover"
              alt=""
            />

            <ImageUploader onSelect={updateAvatar}>
              <button
                className="
                mt-3
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-white
                "
              >
                Change Avatar
              </button>
            </ImageUploader>
          </div>


          <div className="flex-1">

            <img
              src={
                profile?.cover_url ||
                "/quavron-logo.png"
              }
              className="h-32 w-full rounded-xl object-cover"
              alt=""
            />

            <ImageUploader onSelect={updateCover}>
              <button
                className="
                mt-3
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-white
                "
              >
                Change Cover
              </button>
            </ImageUploader>

          </div>

        </div>

      </section>


      {message && (
        <div
          className="
          mt-5
          rounded-xl
          border
          border-[var(--q-border)]
          bg-[var(--q-card)]
          p-3
          text-[var(--q-text)]
          "
        >
          {message}
        </div>
      )}


      <div className="mt-10 space-y-8">
        <section>
          <h2 className="mb-4 text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">
            Basic Information
          </h2>

          <div className="grid gap-3 md:grid-cols-2">
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
              onChange={() => {}}
              disabled
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => update("phone", v)}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">
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
              <label className="mb-2 block text-xs md:text-sm text-[var(--q-muted)]">
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
                  border-[var(--q-border)]
                  bg-[var(--q-surface)]
                  p-3
                  text-[var(--q-text)]
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
          disabled={saving}
          className="
            rounded-xl
            bg-blue-600
            px-4 md:px-6
            py-3
            font-semibold
            text-[var(--q-text)]
            transition
            hover:bg-blue-700
            disabled:opacity-60
          "
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs md:text-sm text-[var(--q-muted)]">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-xl
          border
          border-[var(--q-border)]
          bg-[var(--q-surface)]
          p-3
          text-[var(--q-text)]
          outline-none
          focus:border-blue-500
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      />
    </div>
  );
}

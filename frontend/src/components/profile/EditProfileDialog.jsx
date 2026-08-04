import { useEffect, useState } from "react";

import Modal from "../ui/Modal";

import VerificationRequestService from "../../services/VerificationRequestService";
import VerificationCard from "./verification/VerificationCard";
import VerificationDialog from "./verification/VerificationDialog";

import { useProfile } from "../../context/ProfileContext";
import ProfileService from "../../services/ProfileService";

export default function EditProfileDialog({
  profile,
  open,
  onClose,
}) {
  const {

  saveProfile,

  updateAvatar,

  updateCover,

} = useProfile();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const [request, setRequest] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);

  const [saving, setSaving] = useState(false);

  const [usernameError, setUsernameError] = useState("");

  const [verificationOpen, setVerificationOpen] =
    useState(false);

  useEffect(() => {
    if (!profile) return;

    setFullName(profile.full_name || "");
    setUsername(profile.username || "");
    setBio(profile.bio || "");
    setWebsite(profile.website || "");
    setLocation(profile.location || "");
  }, [profile]);

  useEffect(() => {
    async function loadRequest() {
      if (!profile?.id) return;

      const { data } =
        await VerificationRequestService.getMyRequest(
          profile.id
        );

      setRequest(data);
    }

    if (open) {
      loadRequest();
    }
  }, [open, profile]);

  async function handleSave() {
    try {
      setSaving(true);

      setUsernameError("");

      const available =
        await ProfileService.isUsernameAvailable(
          username,
          profile.id
        );

      if (!available) {
        setUsernameError(
          "Username already exists."
        );

        setSaving(false);

        return;
      }

      let avatarUrl = profile.avatar_url;

if (avatar) {

  avatarUrl = await updateAvatar(avatar);

}

let coverUrl = profile.cover_url;

if (cover) {

  coverUrl = await updateCover(cover);

}


      await saveProfile({
        full_name: fullName,
        username,
        bio,
        website,
        location,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
      });

      onClose();
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        maxWidth="max-w-2xl"
      >
        <div className="p-8">
          <h2 className="mb-8 text-3xl font-bold text-[var(--q-text)]">
            Edit Profile
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Username
              </label>

              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)] outline-none"
              />

              {usernameError && (
                <p className="mt-2 text-sm text-red-500">
                  {usernameError}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Bio
              </label>

              <textarea
                rows={4}
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Website
              </label>

              <input
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Location
              </label>

              <input
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Avatar
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setAvatar(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[var(--q-muted)]">
                Cover Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCover(
                    e.target.files?.[0] || null
                  )
                }
                className="w-full rounded-xl bg-[var(--q-surface)] p-3 text-[var(--q-text)]"
              />
            </div>
          </div>

          <div className="mt-8">
            <VerificationCard
              request={request}
              status={
                profile?.verified
                  ? "Verified"
                  : "Not Verified"
              }
              onRequest={() =>
                setVerificationOpen(true)
              }
            />
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-xl bg-[var(--q-card)] px-6 py-3 text-[var(--q-text)] transition hover:bg-[var(--q-surface)]"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              onClick={handleSave}
              className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <VerificationDialog
        profile={profile}
        open={verificationOpen}
        onClose={() =>
          setVerificationOpen(false)
        }
      />
    </>
  );
}

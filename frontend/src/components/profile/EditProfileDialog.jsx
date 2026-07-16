import { useEffect, useState } from "react";

import { useProfile } from "../../context/ProfileContext";
import ProfileService from "../../services/ProfileService";

export default function EditProfileDialog({

  profile,

  open,

  onClose,

}) {

  const { saveProfile } =
    useProfile();

  const [fullName, setFullName] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [avatar, setAvatar] =
    useState(null);

  const [cover, setCover] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!profile) return;

    setFullName(
      profile.full_name || ""
    );

    setUsername(
      profile.username || ""
    );

    setBio(
      profile.bio || ""
    );

    setWebsite(
      profile.website || ""
    );

    setLocation(
      profile.location || ""
    );

  }, [profile]);

  if (!open) return null;

  async function handleSave() {

    try {

      setSaving(true);

      let avatarUrl =
        profile.avatar_url;

      let coverUrl =
        profile.cover_url;

      if (avatar) {

        avatarUrl =
          await ProfileService.uploadAvatar(
            profile.id,
            avatar
          );

      }

      if (cover) {

        coverUrl =
          await ProfileService.uploadCover(
            profile.id,
            cover
          );

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

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-slate-900 p-8">

        <h2 className="mb-8 text-3xl font-bold text-white">

          Edit Profile

        </h2>

        <div className="space-y-6">

          <div>

            <label className="mb-2 block text-slate-300">

              Full Name

            </label>

            <input
              value={fullName}
              onChange={(e)=>
                setFullName(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-slate-300">

              Username

            </label>

            <input
              value={username}
              onChange={(e)=>
                setUsername(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-slate-300">

              Bio

            </label>

            <textarea
              rows={4}
              value={bio}
              onChange={(e)=>
                setBio(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
            />

          </div>
          <div>

            <label className="mb-2 block text-slate-300">

              Website

            </label>

            <input
              value={website}
              onChange={(e)=>
                setWebsite(e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-slate-300">

              Location

            </label>

            <input
              value={location}
              onChange={(e)=>
                setLocation(e.target.value)
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white outline-none"
            />

          </div>

          <div>

            <label className="mb-2 block text-slate-300">

              Avatar

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e)=>
                setAvatar(
                  e.target.files?.[0] || null
                )
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white"
            />

          </div>

          <div>

            <label className="mb-2 block text-slate-300">

              Cover Image

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e)=>
                setCover(
                  e.target.files?.[0] || null
                )
              }
              className="w-full rounded-xl bg-slate-800 p-3 text-white"
            />

          </div>

        </div>

        <div className="mt-10 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-6 py-3 text-white transition hover:bg-slate-600"
          >

            Cancel

          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >

            {

              saving

                ? "Saving..."

                : "Save Changes"

            }

          </button>

        </div>

      </div>

    </div>

  );

}

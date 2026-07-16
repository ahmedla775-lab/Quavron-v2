import { useState } from "react";

import { supabase } from "../../lib/supabase";
import { useProfile } from "../../context/ProfileContext";

export default function EditProfileDialog({

  profile,

  open,

  onClose,

  onSaved,

}) {

  const { updateProfile } = useProfile();

  const [fullName, setFullName] =
    useState(profile?.full_name || "");

  const [username, setUsername] =
    useState(profile?.username || "");

  const [bio, setBio] =
    useState(profile?.bio || "");

  const [website, setWebsite] =
    useState(profile?.website || "");

  const [location, setLocation] =
    useState(profile?.location || "");

  const [avatar, setAvatar] =
    useState(null);

  const [cover, setCover] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  if (!open) return null;

  async function upload(file, folder) {

    if (!file) return null;

    const ext = file.name.split(".").pop();

    const path =
      `${folder}/${profile.id}.${ext}`;

    const { error } =
      await supabase.storage
        .from("post-media")
        .upload(path, file, {
          upsert: true,
        });

    if (error) throw error;

    const { data } =
      supabase.storage
        .from("post-media")
        .getPublicUrl(path);

    return data.publicUrl;

  }

  async function save() {

    setLoading(true);

    try {

      let avatarUrl =
        profile.avatar_url;

      let coverUrl =
        profile.cover_url;

      if (avatar) {

        avatarUrl =
          await upload(
            avatar,
            "avatars"
          );

      }

      if (cover) {

        coverUrl =
          await upload(
            cover,
            "covers"
          );

      }

      await updateProfile({

        full_name: fullName,

        username,

        bio,

        website,

        location,

        avatar_url: avatarUrl,

        cover_url: coverUrl,

      });

      if (onSaved) {

        onSaved();

      }

      onClose();

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-full max-w-xl rounded-2xl bg-slate-900 p-6">

        <h2 className="mb-6 text-2xl font-bold text-white">

          Edit Profile

        </h2>

        <div className="space-y-4">

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Full Name"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            placeholder="Username"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            placeholder="Bio"
            rows={4}
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            type="text"
            value={website}
            onChange={(e) =>
              setWebsite(e.target.value)
            }
            placeholder="Website"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          <input
            type="text"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Location"
            className="w-full rounded-lg bg-slate-800 p-3 text-white"
          />

          <div>

            <p className="mb-2 text-sm text-slate-400">

              Avatar

            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatar(
                  e.target.files?.[0] ?? null
                )
              }
            />

          </div>

          <div>

            <p className="mb-2 text-sm text-slate-400">

              Cover

            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCover(
                  e.target.files?.[0] ?? null
                )
              }
            />

          </div>

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-5 py-2 text-white"
          >

            Cancel

          </button>

          <button
            disabled={loading}
            onClick={save}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white"
          >

            {loading ? "Saving..." : "Save"}

          </button>

        </div>

      </div>

    </div>

  );

}

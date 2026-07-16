import { useState } from "react";

import EditProfileDialog from "./EditProfileDialog";

export default function ProfileHeader({ profile }) {

  const [open, setOpen] = useState(false);

  return (
    <>

      <div className="relative">

        <div className="h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700">

          {profile?.cover_url && (

            <img
              src={profile.cover_url}
              alt="Cover"
              className="h-full w-full object-cover"
            />

          )}

        </div>

        <div className="mx-auto max-w-6xl px-8">

          <div className="-mt-20 flex items-end justify-between">

            <div className="flex items-end gap-6">

              <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-slate-950 bg-slate-800">

                {profile?.avatar_url ? (

                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="h-full w-full object-cover"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-5xl font-bold text-white">

                    {profile?.full_name?.charAt(0)?.toUpperCase() || "Q"}

                  </div>

                )}

              </div>

              <div className="pb-5">

                <h1 className="text-4xl font-bold text-white">

                  {profile?.full_name}

                </h1>

                <p className="text-slate-400">

                  @{profile?.username}

                </p>

              </div>

            </div>

            <button
              onClick={() => setOpen(true)}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Edit Profile
            </button>

          </div>

        </div>

      </div>

      <EditProfileDialog
        open={open}
        profile={profile}
        onClose={() => setOpen(false)}
      />

    </>
  );

}

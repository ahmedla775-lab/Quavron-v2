import {
  MapPin,
  Globe,
  CheckCircle,
  Pencil,
  Share2,
} from "lucide-react";

export default function ProfileHeader({

  profile,

  onEdit,

}) {

  async function shareProfile() {

    const url = window.location.href;

    if (navigator.share) {

      await navigator.share({

        title: profile?.full_name,

        text: `Check out ${profile?.full_name} on Quavron`,

        url,

      });

      return;

    }

    await navigator.clipboard.writeText(url);

    alert("Profile link copied.");

  }

  return (

    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

      <div className="relative h-72 w-full">

        {profile?.cover_url ? (

          <img
            src={profile.cover_url}
            alt="Cover"
            className="h-full w-full object-cover"
          />

        ) : (

          <div className="h-full w-full bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-700" />

        )}

      </div>

      <div className="relative px-8 pb-8">

        <div className="-mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div className="flex items-end gap-6">

            <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-slate-900 bg-slate-800">

              {profile?.avatar_url ? (

                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-white">

                  {profile?.full_name?.charAt(0)?.toUpperCase() || "Q"}

                </div>

              )}

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-4xl font-bold text-white">

                  {profile?.full_name || "Quavron User"}

                </h1>

                {profile?.verified && (

                  <CheckCircle
                    size={24}
                    className="text-sky-400"
                  />

                )}

              </div>

              <p className="mt-1 text-slate-400">

                @{profile?.username}

              </p>

              {profile?.bio && (

                <p className="mt-4 max-w-2xl text-slate-300">

                  {profile.bio}

                </p>

              )}

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">

                {profile?.location && (

                  <div className="flex items-center gap-2">

                    <MapPin size={16} />

                    {profile.location}

                  </div>

                )}

                {profile?.website && (

                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sky-400 hover:underline"
                  >

                    <Globe size={16} />

                    {profile.website}

                  </a>

                )}

              </div>

            </div>

          </div>

          <div className="flex gap-3">

            <button
              onClick={shareProfile}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-white transition hover:bg-slate-700"
            >

              <Share2 size={18} />

              Share

            </button>

            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700"
            >

              <Pencil size={18} />

              Edit Profile

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

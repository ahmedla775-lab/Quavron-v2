import {
  MapPin,
  Globe,
  BadgeCheck,
  Calendar,
  Share2,
  Pencil,
} from "lucide-react";

export default function ProfileHeader({

  profile,

  onEdit,

}) {

  return (

    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

      <div
        className="h-56 w-full bg-cover bg-center"
        style={{
          backgroundImage: profile?.cover_url
            ? `url(${profile.cover_url})`
            : "linear-gradient(135deg,#2563eb,#0f172a)",
        }}
      />

      <div className="px-8 pb-8">

        <div className="-mt-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex gap-6">

            <img
              src={
                profile?.avatar_url ||
                "https://placehold.co/160x160"
              }
              alt=""
              className="h-40 w-40 rounded-full border-4 border-slate-900 object-cover"
            />

            <div className="pt-20">

              <div className="flex items-center gap-2">

                <h1 className="text-3xl font-bold text-white">

                  {profile?.full_name}

                </h1>

                {profile?.verified && (

                  <BadgeCheck
                    size={24}
                    className="text-blue-500"
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

                  <div className="flex items-center gap-2">

                    <Globe size={16} />

                    {profile.website}

                  </div>

                )}

                {profile?.created_at && (

                  <div className="flex items-center gap-2">

                    <Calendar size={16} />

                    Joined{" "}
                    {new Date(
                      profile.created_at
                    ).getFullYear()}

                  </div>

                )}

              </div>

            </div>

          </div>

          <div className="flex gap-3">

            <button
              className="rounded-xl border border-slate-700 px-5 py-3 text-white transition hover:bg-slate-800"
            >

              <Share2 size={18} />

            </button>

            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
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

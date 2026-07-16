import {
  Globe,
  MapPin,
  Calendar,
  BadgeCheck,
  User,
} from "lucide-react";

export default function ProfileAbout({

  profile,

}) {

  return (

    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

      <h2 className="mb-8 text-3xl font-bold text-white">

        About

      </h2>

      <div className="space-y-8">

        <div className="flex items-start gap-4">

          <User
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Full Name

            </p>

            <p className="mt-1 text-lg font-medium text-white">

              {profile?.full_name || "-"}

            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <BadgeCheck
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Username

            </p>

            <p className="mt-1 text-lg font-medium text-white">

              @{profile?.username || "-"}

            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <User
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Bio

            </p>

            <p className="mt-1 whitespace-pre-wrap text-slate-300">

              {profile?.bio || "No bio yet."}

            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <MapPin
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Location

            </p>

            <p className="mt-1 text-white">

              {profile?.location || "-"}

            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <Globe
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Website

            </p>

            {profile?.website ? (

              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block break-all text-sky-400 hover:underline"
              >

                {profile.website}

              </a>

            ) : (

              <p className="mt-1 text-white">

                -

              </p>

            )}

          </div>

        </div>

        <div className="flex items-start gap-4">

          <Calendar
            className="mt-1 text-sky-400"
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Joined

            </p>

            <p className="mt-1 text-white">

              {profile?.created_at
                ? new Date(
                    profile.created_at
                  ).toLocaleDateString()
                : "-"}

            </p>

          </div>

        </div>

        <div className="flex items-start gap-4">

          <BadgeCheck
            className={`mt-1 ${
              profile?.verified
                ? "text-green-400"
                : "text-slate-500"
            }`}
            size={22}
          />

          <div>

            <p className="text-sm text-slate-400">

              Verification

            </p>

            <p
              className={`mt-1 font-medium ${
                profile?.verified
                  ? "text-green-400"
                  : "text-slate-400"
              }`}
            >

              {profile?.verified
                ? "Verified Account"
                : "Not Verified"}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

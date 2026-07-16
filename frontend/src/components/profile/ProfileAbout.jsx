export default function ProfileAbout({ profile }) {

  return (

    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">

        About

      </h2>

      <div className="space-y-5">

        <div>

          <p className="text-sm text-slate-400">

            Full Name

          </p>

          <p className="text-lg text-white">

            {profile?.full_name || "-"}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Username

          </p>

          <p className="text-lg text-white">

            @{profile?.username || "-"}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Bio

          </p>

          <p className="text-lg text-white whitespace-pre-wrap">

            {profile?.bio || "No bio yet."}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Location

          </p>

          <p className="text-lg text-white">

            {profile?.location || "-"}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Website

          </p>

          {profile?.website ? (

            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline"
            >

              {profile.website}

            </a>

          ) : (

            <p className="text-white">

              -

            </p>

          )}

        </div>

        <div>

          <p className="text-sm text-slate-400">

            Joined

          </p>

          <p className="text-white">

            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "-"}

          </p>

        </div>

      </div>

    </div>

  );

}

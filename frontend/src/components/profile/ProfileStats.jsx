export default function ProfileStats({ profile }) {

  const stats = [

    {
      label: "Posts",
      value: profile?.posts_count ?? 0,
    },

    {
      label: "Followers",
      value: profile?.followers_count ?? 0,
    },

    {
      label: "Following",
      value: profile?.following_count ?? 0,
    },

    {
      label: "Verified",
      value: profile?.verified ? "Yes" : "No",
    },

  ];

  return (

    <div className="mt-6 grid gap-4 md:grid-cols-4">

      {stats.map((item) => (

        <div
          key={item.label}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center"
        >

          <p className="text-sm text-slate-400">

            {item.label}

          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">

            {item.value}

          </h2>

        </div>

      ))}

    </div>

  );

}

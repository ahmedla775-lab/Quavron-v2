export default function ProfileStats({

  profile,

}) {

  const stats = [

    {
      title: "Followers",
      value: profile?.followers_count || 0,
    },

    {
      title: "Following",
      value: profile?.following_count || 0,
    },

    {
      title: "Projects",
      value: profile?.projects_count || 0,
    },

    {
      title: "Posts",
      value: profile?.posts_count || 0,
    },

    {
      title: "Reputation",
      value: profile?.reputation || 0,
    },

    {
      title: "Level",
      value: profile?.level || 1,
    },

  ];

  return (

    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

      {stats.map((item) => (

        <div
          key={item.title}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center transition hover:border-blue-500"
        >

          <p className="text-3xl font-bold text-white">

            {item.value}

          </p>

          <p className="mt-2 text-sm text-slate-400">

            {item.title}

          </p>

        </div>

      ))}

    </div>

  );

}

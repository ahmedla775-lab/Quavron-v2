import {
  Users,
  UserPlus,
  FileText,
  Image,
} from "lucide-react";

export default function ProfileStats({

  profile,

  mediaCount = 0,

}) {

  const cards = [

    {
      title: "Posts",
      value: profile?.posts_count || 0,
      icon: <FileText size={22} />,
    },

    {
      title: "Followers",
      value: profile?.followers_count || 0,
      icon: <Users size={22} />,
    },

    {
      title: "Following",
      value: profile?.following_count || 0,
      icon: <UserPlus size={22} />,
    },

    {
      title: "Media",
      value: mediaCount,
      icon: <Image size={22} />,
    },

  ];

  return (

    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

      {cards.map((item) => (

        <div
          key={item.title}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-sky-500"
        >

          <div className="flex items-center justify-between">

            <span className="text-slate-400">

              {item.title}

            </span>

            <div className="text-sky-400">

              {item.icon}

            </div>

          </div>

          <h2 className="mt-4 text-4xl font-bold text-white">

            {item.value}

          </h2>

        </div>

      ))}

    </div>

  );

}

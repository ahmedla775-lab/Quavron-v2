import {
  FileText,
  Users,
  UserPlus,
  FolderKanban,
  Award,
  Eye,
  Store,
  GraduationCap,
} from "lucide-react";

export default function ProfileStats({ profile }) {

  const stats = [

    {
      label: "Posts",
      value: profile?.posts_count ?? 0,
      icon: FileText,
    },

    {
      label: "Followers",
      value: profile?.followers_count ?? 0,
      icon: Users,
    },

    {
      label: "Following",
      value: profile?.following_count ?? 0,
      icon: UserPlus,
    },

    {
      label: "Projects",
      value: profile?.projects_count ?? 0,
      icon: FolderKanban,
    },

    {
      label: "Courses",
      value: profile?.courses_count ?? 0,
      icon: GraduationCap,
    },

    {
      label: "Marketplace",
      value: profile?.marketplace_count ?? 0,
      icon: Store,
    },

    {
      label: "Reputation",
      value: profile?.reputation ?? 0,
      icon: Award,
    },

    {
      label: "Views",
      value: profile?.profile_views ?? 0,
      icon: Eye,
    },

  ];

  return (

    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.label}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >

            <div className="flex items-center justify-between">

              <span className="text-slate-400 text-sm">

                {item.label}

              </span>

              <Icon
                size={18}
                className="text-blue-400"
              />

            </div>

            <h3 className="mt-3 text-2xl font-bold text-white">

              {item.value}

            </h3>

          </div>

        );

      })}

    </div>

  );

}

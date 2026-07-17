import {
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Languages,
} from "lucide-react";

export default function ProfileAbout({ profile }) {

  const items = [

    {
      icon: Globe,
      label: "Website",
      value: profile?.website,
    },

    {
      icon: MapPin,
      label: "Location",
      value: profile?.location,
    },

    {
      icon: Briefcase,
      label: "Headline",
      value: profile?.headline,
    },

    {
      icon: GraduationCap,
      label: "Education",
      value: profile?.education,
    },

    {
      icon: Languages,
      label: "Languages",
      value: profile?.languages,
    },

    {
      icon: Calendar,
      label: "Joined",
      value: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString()
        : null,
    },

  ];

  return (

    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

      <h2 className="mb-6 text-2xl font-bold text-white">

        About

      </h2>

      <div className="space-y-5">

        <div>

          <h3 className="mb-2 text-slate-400">

            Bio

          </h3>

          <p className="text-white">

            {profile?.bio || "No bio yet."}

          </p>

        </div>

        {items.map((item) => {

          if (!item.value) return null;

          const Icon = item.icon;

          return (

            <div
              key={item.label}
              className="flex items-center gap-3"
            >

              <Icon
                size={18}
                className="text-blue-400"
              />

              <span className="text-slate-300">

                {item.value}

              </span>

            </div>

          );

        })}

      </div>

    </div>

  );

}

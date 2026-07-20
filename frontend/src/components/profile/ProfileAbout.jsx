import {
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Languages,
  BadgeInfo,
  Send,
  PlayCircle,
} from "lucide-react";

export default function ProfileAbout({ profile }) {
  const items = [
    {
      icon: Globe,
      label: "Website",
      value: profile?.website,
      link: profile?.website,
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
    {
      icon: BadgeInfo,
      label: "GitHub",
      value: profile?.github_url,
      link: profile?.github_url,
    },
    {
      icon: BadgeInfo,
      label: "LinkedIn",
      value: profile?.linkedin_url,
      link: profile?.linkedin_url,
    },
    {
      icon: Globe,
      label: "X",
      value: profile?.x_url,
      link: profile?.x_url,
    },
    {
      icon: PlayCircle,
      label: "YouTube",
      value: profile?.youtube_url,
      link: profile?.youtube_url,
    },
    {
      icon: Send,
      label: "Telegram",
      value: profile?.telegram_url,
      link: profile?.telegram_url,
    },
  ];

  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
      <h2 className="mb-8 text-2xl font-bold text-white">
        About
      </h2>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <h3 className="mb-3 text-lg font-semibold text-white">
          Biography
        </h3>

        <p className="leading-7 text-slate-300">
          {profile?.bio || "No biography yet."}
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          if (!item.value) return null;

          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-blue-500"
            >
              <div className="mb-3 flex items-center gap-3">
                <Icon
                  size={20}
                  className="text-blue-400"
                />

                <span className="font-semibold text-white">
                  {item.label}
                </span>
              </div>

              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-400 hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <p className="break-words text-slate-300">
                  {item.value}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

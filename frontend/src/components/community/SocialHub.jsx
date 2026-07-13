import {
  Play,
  Music2,
  Camera,
  Briefcase,
  Globe,
  MessageSquare,
  Tv,
} from "lucide-react";

const platforms = [
  {
    name: "YouTube",
    icon: Play,
    color: "bg-red-600",
  },
  {
    name: "TikTok",
    icon: Music2,
    color: "bg-black",
  },
  {
    name: "Instagram",
    icon: Camera,
    color: "bg-pink-600",
  },
  {
    name: "Facebook",
    icon: Globe,
    color: "bg-blue-600",
  },
  {
    name: "LinkedIn",
    icon: Briefcase,
    color: "bg-sky-700",
  },
  {
    name: "X",
    icon: MessageSquare,
    color: "bg-slate-700",
  },
  {
    name: "Snapchat",
    icon: Tv,
    color: "bg-yellow-500",
  },
];

export default function SocialHub() {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h2 className="mb-5 text-xl font-bold text-white">
        🌐 Social Hub
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {platforms.map((item) => {

          const Icon = item.icon;

          return (

            <button
              key={item.name}
              className="rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-500 hover:bg-slate-700"
            >

              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.color}`}
              >

                <Icon
                  size={28}
                  className="text-white"
                />

              </div>

              <h3 className="font-semibold text-white">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Connected Soon
              </p>

            </button>

          );

        })}

      </div>

    </div>

  );

}

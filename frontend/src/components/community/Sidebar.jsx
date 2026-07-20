import {
  Home,
  Compass,
  PlaySquare,
  Clapperboard,
  Code2,
  FolderGit2,
  Briefcase,
  Bell,
  MessageCircle,
  Bookmark,
  Users,
} from "lucide-react";

const items = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: Clapperboard, label: "Reels" },
  { icon: PlaySquare, label: "Videos" },
  { icon: Code2, label: "Developers" },
  { icon: FolderGit2, label: "Projects" },
  { icon: Briefcase, label: "Jobs" },
  { icon: Users, label: "Social Hub" },
  { icon: MessageCircle, label: "Messages" },
  { icon: Bell, label: "Notifications" },
  { icon: Bookmark, label: "Saved" },
];

export default function Sidebar({
  active = "Home",
  onChange,
}) {
  return (
    <div
      className="
        h-full
        overflow-y-auto
        bg-slate-900
        p-4
        pb-24
      "
    >
      <h2 className="mb-6 text-2xl font-bold text-white">
        Community
      </h2>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const selected = active === item.label;

          return (
            <button
              key={item.label}
              onClick={() => onChange?.(item.label)}
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                transition

                ${
                  selected
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

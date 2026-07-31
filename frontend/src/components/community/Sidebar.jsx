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
        bg-[var(--q-surface)]
        text-[var(--q-text)]
        p-4
        pb-24
      "
    >
      <h2
        className="
          mb-6
          text-2xl
          font-bold
          text-[var(--q-text)]
        "
      >
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
                transition-colors
                ${
                  selected
                    ? "bg-[var(--q-primary)] text-white"
                    : "text-[var(--q-muted)] hover:bg-[var(--q-card)] hover:text-[var(--q-text)]"
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import {
  FolderOpen,
  Search,
  GitBranch,
  Play,
  Blocks,
  Bot,
  Settings,
} from "lucide-react";

import ActivityButton from "./ActivityButton";

const items = [
  {
    id: "explorer",
    icon: FolderOpen,
    label: "Explorer",
  },
  {
    id: "search",
    icon: Search,
    label: "Search",
  },
  {
    id: "git",
    icon: GitBranch,
    label: "Source Control",
  },
  {
    id: "debug",
    icon: Play,
    label: "Run & Debug",
  },
  {
    id: "extensions",
    icon: Blocks,
    label: "Extensions",
  },
  {
    id: "ai",
    icon: Bot,
    label: "AI Assistant",
  },
];

export default function ActivityBar({

  active,

  onChange,

}) {

  return (

    <aside className="flex h-full w-14 flex-col justify-between border-r border-slate-800 bg-slate-950">

      <div>

        {items.map((item) => (

          <ActivityButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={active === item.id}
            onClick={() => onChange(item.id)}
          />

        ))}

      </div>

      <ActivityButton
        icon={Settings}
        label="Workspace Settings"
        active={active === "settings"}
        onClick={() => onChange("settings")}
      />

    </aside>

  );

}

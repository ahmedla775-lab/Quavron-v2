import {
  Home,
  Code2,
  Bot,
  Users,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider";

const items = [
  { name: "Home", path: "/dashboard", icon: Home },
  { name: "IDE", path: "/ide", icon: Code2 },
  { name: "AI", path: "/ai", icon: Bot },
  { name: "Community", path: "/community", icon: Users },
  { name: "Profile", path: "/profile", icon: User },
];

export default function MobileBottomNav() {
  const { isDark } = useTheme();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[9999] flex h-14 items-center justify-around backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom)]"
      style={{
        background: isDark
          ? "rgba(2,6,23,.96)"
          : "rgba(255,255,255,.96)",
        borderTop: `1px solid ${
          isDark ? "#1e293b" : "#e5e7eb"
        }`,
        boxShadow: "0 -8px 30px rgba(0,0,0,.15)",
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] transition ${
                isActive
                  ? "text-cyan-500"
                  : isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`
            }
          >
            <Icon size={19} />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

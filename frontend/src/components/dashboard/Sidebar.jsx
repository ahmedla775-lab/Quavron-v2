import {
  LayoutDashboard,
  Code2,
  Bot,
  BookOpen,
  ShoppingCart,
  Cloud,
  Users,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Cloud IDE",
    icon: Code2,
    path: "/ide",
  },
  {
    title: "AI Assistant",
    icon: Bot,
    path: "/ai",
  },
  {
    title: "Courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    title: "Marketplace",
    icon: ShoppingCart,
    path: "/marketplace",
  },
  {
    title: "Hosting",
    icon: Cloud,
    path: "/hosting",
  },
  {
    title: "Community",
    icon: Users,
    path: "/community",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">

      <div className="border-b border-slate-800 p-6">

        <h1 className="text-3xl font-extrabold text-blue-500">
          Quavron
        </h1>

      </div>

      <nav className="flex-1 space-y-2 p-4">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );

        })}

      </nav>

    </aside>
  );
}


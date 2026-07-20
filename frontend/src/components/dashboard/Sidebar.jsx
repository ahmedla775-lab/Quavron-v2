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
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import useResponsive from "../../hooks/useResponsive";

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Cloud IDE", icon: Code2, path: "/ide" },
  { title: "AI Assistant", icon: Bot, path: "/ai" },
  { title: "Courses", icon: BookOpen, path: "/courses" },
  { title: "Marketplace", icon: ShoppingCart, path: "/marketplace" },
  { title: "Hosting", icon: Cloud, path: "/hosting" },
  { title: "Community", icon: Users, path: "/community" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const {
    isDesktop,
    isTablet,
    isMobile,
  } = useResponsive();

  const showSidebar = isDesktop || open;

  return (
    <>
      {/* Mobile / Tablet Menu Button */}
      {!isDesktop && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            left-4
            top-4
            z-50
            rounded-xl
            bg-slate-900
            p-2
            text-white
            shadow-lg
          "
        >
          <Menu size={22} />
        </button>
      )}

      {/* Overlay */}
      {showSidebar && !isDesktop && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-slate-800
          bg-slate-950
          transition-transform
          duration-300

          ${
            isDesktop
              ? "translate-x-0"
              : showSidebar
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            p-5
          "
        >
          <img
            src="/quavron-logo.png"
            alt="Quavron"
            className="h-16 w-auto object-contain"
          />

          {!isDesktop && (
            <button
              onClick={() => setOpen(false)}
              className="text-white"
            >
              <X size={24} />
            </button>
          )}
        </div>


        {/* Navigation */}
        <nav
          className="
            flex-1
            space-y-2
            overflow-y-auto
            p-4
          "
        >
          {menu.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (!isDesktop) {
                    setOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-4
                  py-3
                  transition

                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }
                  `
                }
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );

          })}
        </nav>

      </aside>


      {/* Desktop Space Reservation */}
      {isDesktop && (
        <div className="w-72 shrink-0" />
      )}

    </>
  );
}

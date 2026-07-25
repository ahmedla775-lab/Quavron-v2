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
import { useTranslation } from "react-i18next";

import { useAuth } from "../auth/AuthProvider";
import useResponsive from "../../hooks/useResponsive";

const menu = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "cloudIDE",
    icon: Code2,
    path: "/ide",
  },
  {
    key: "aiAssistant",
    icon: Bot,
    path: "/ai",
  },
  {
    key: "courses",
    icon: BookOpen,
    path: "/courses",
  },
  {
    key: "marketplace",
    icon: ShoppingCart,
    path: "/marketplace",
  },
  {
    key: "hosting",
    icon: Cloud,
    path: "/hosting",
  },
  {
    key: "community",
    icon: Users,
    path: "/community",
  },
  {
    key: "analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    key: "profile",
    icon: User,
    path: "/profile",
  },
  {
    key: "settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const { t } = useTranslation();

  const { profile } = useAuth();

  const { isDesktop } = useResponsive();

  const [open, setOpen] = useState(false);

  const navigation = [...menu];

  if (
    profile?.role === "owner" ||
    profile?.role === "admin"
  ) {
    navigation.push({
      key: "admin",
      icon: Settings,
      path: "/admin",
    });
  }

  return (
    <>
      {!isDesktop && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed
            left-3
            top-3
            z-[70]
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-slate-900/95
            backdrop-blur
            border
            border-slate-800
            shadow-xl
          "
        >
          <Menu size={20} />
        </button>
      )}

      {!isDesktop && open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-[60]
            bg-black/60
            backdrop-blur-sm
          "
        />
      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-[70]
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
              : open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            px-5
            py-5
          "
        >
          <img
            src="/quavron-logo.png"
            alt="Quavron"
            className="h-12 w-auto"
          />

          {!isDesktop && (
            <button
              onClick={() => setOpen(false)}
              className="
                rounded-lg
                p-2
                hover:bg-slate-800
              "
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav
          className="
            flex-1
            overflow-y-auto
            p-3
            space-y-1
          "
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => !isDesktop && setOpen(false)}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800"
                  }
                `
                }
              >
                <Icon size={20} />

                <span className="font-medium">
                  {t(`sidebar.${item.key}`)}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {isDesktop && (
        <div className="w-72 shrink-0" />
      )}
    </>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";

import Input from "../ui/Input";
import VerificationBadge from "../profile/VerificationBadge";

import { useAuth } from "../auth/AuthProvider";
import { useProfile } from "../../context/ProfileContext";
import { useTheme } from "../../theme/ThemeProvider";
import { logout } from "../../services/AuthService";
import useResponsive from "../../hooks/useResponsive";

export default function Topbar() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { profile } = useProfile();
  const { isMobile } = useResponsive();
  const { isDark, toggleTheme } = useTheme();

  const [openMenu, setOpenMenu] = useState(false);

  const logo = isDark
    ? "/branding/logo-symbol.png"
    : "/branding/logo-symbol.png";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl transition-all"
      style={{
        background: isDark
          ? "rgba(11,13,16,.92)"
          : "rgba(255,255,255,.92)",
        borderColor: "var(--q-border)",
      }}
    >
      <div
        className={`flex h-16 items-center justify-between gap-4 ${
          isMobile ? "pl-20 pr-4" : "px-6"
        }`}
      >
        {isMobile ? (
          <div className="ml-16 flex items-center">
            <img
              src={logo}
              alt="Quavron"
              className="h-10 w-auto object-contain"
            />
          </div>
        ) : (
          <div className="w-full max-w-md">
            <Input
              placeholder="Search..."
              icon={<Search size={18} />}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[var(--q-surface)]"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-[var(--q-surface)]">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {!isMobile && (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-[var(--q-surface)]"
              >
                <img
                  src={
                    profile?.avatar_url ??
                    "https://ui-avatars.com/api/?background=1E88E5&color=fff&name=Q"
                  }
                  alt="avatar"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {profile?.full_name ?? "Quavron"}
                    </span>

                    <VerificationBadge
                      verified={profile?.verified}
                      verificationType={profile?.verification_type}
                    />
                  </div>

                  <div className="text-xs opacity-70">
                    @{profile?.username ?? user?.email}
                  </div>
                </div>

                <ChevronDown size={18} />
              </button>

              {openMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border shadow-xl"
                  style={{
                    background: "var(--q-surface)",
                    borderColor: "var(--q-border)",
                  }}
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--q-primary)]/10"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--q-primary)]/10"
                  >
                    <Settings size={18} />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

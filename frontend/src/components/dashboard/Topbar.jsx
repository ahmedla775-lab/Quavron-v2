import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Search,
} from "lucide-react";

import Input from "../ui/Input";
import VerificationBadge from "../profile/VerificationBadge";

import { useAuth } from "../auth/AuthProvider";
import { useProfile } from "../../context/ProfileContext";

import { logout } from "../../services/AuthService";
import useResponsive from "../../hooks/useResponsive";

export default function Topbar() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { profile } = useProfile();

  const { isMobile, isTablet } = useResponsive();

  const [openMenu, setOpenMenu] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        border-b
        border-slate-800
        bg-slate-950/95
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          items-center
          justify-between
          gap-3
          px-3
          sm:px-4
          lg:px-8
        "
      >
        {/* Left */}

        {isMobile ? (
          <div className="ml-12 font-bold text-lg">
            Quavron
          </div>
        ) : (
          <div
            className={`
              w-full
              ${
                isTablet
                  ? "max-w-xs"
                  : "max-w-md"
              }
            `}
          >
            <Input
              placeholder="Search..."
              icon={<Search size={18} />}
            />
          </div>
        )}

        {/* Right */}

        <div className="flex items-center gap-2">

          <button
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              transition
              hover:bg-slate-800
            "
          >
            <Bell size={20} />

            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                rounded-full
                bg-red-500
              "
            />
          </button>

          <div className="relative">

            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="
                flex
                items-center
                gap-3
                rounded-xl
                p-1
                transition
                hover:bg-slate-800
              "
            >
              <img
                src={
                  profile?.avatar_url ||
                  "https://ui-avatars.com/api/?background=2563eb&color=fff&name=Q"
                }
                alt="Avatar"
                className="
                  h-10
                  w-10
                  rounded-full
                  object-cover
                "
              />

              {!isMobile && (
                <>
                  <div className="text-left">

                    <div className="flex items-center gap-2">

                      <span className="font-semibold">
                        {profile?.full_name || "Quavron User"}
                      </span>

                      <VerificationBadge
                        verified={profile?.verified}
                        verificationType={profile?.verification_type}
                        size={15}
                      />

                    </div>

                    <p className="text-xs text-slate-400">
                      @{profile?.username || user?.email || "user"}
                    </p>

                  </div>

                  <ChevronDown
                    size={18}
                    className="text-slate-500"
                  />
                </>
              )}
            </button>

            {openMenu && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-60
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-700
                  bg-slate-900
                  shadow-2xl
                "
              >

                <Link
                  to="/profile"
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    transition
                    hover:bg-slate-800
                  "
                >
                  <User size={18} />
                  Profile
                </Link>

                <Link
                  to="/settings"
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    transition
                    hover:bg-slate-800
                  "
                >
                  <Settings size={18} />
                  Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-left
                    text-red-400
                    transition
                    hover:bg-slate-800
                  "
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </div>
    </header>
  );
}

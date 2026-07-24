import VerificationBadge from "../profile/VerificationBadge";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import Input from "../ui/Input";
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
        px-4
        py-4
        backdrop-blur
        lg:px-8
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >


        {/* Search */}
        {!isMobile && (

          <div
            className={`
              ${
                isTablet
                  ? "max-w-xs"
                  : "max-w-md"
              }
              w-full
            `}
          >

            <Input placeholder="Search..." />

          </div>

        )}



        {/* Mobile Logo Space */}
        {isMobile && (

          <div className="font-bold text-white">
            Quavron
          </div>

        )}



        {/* Actions */}
        <div
          className="
            flex
            items-center
            gap-3
          "
        >


          {/* Notifications */}

          <button
            className="
              relative
              rounded-xl
              p-2
              hover:bg-slate-800
            "
          >

            <Bell size={22}/>

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



          {/* Profile */}

          <div className="relative">


            <button

              onClick={() => setOpenMenu(!openMenu)}

              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-2
                py-2
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

                <div className="hidden text-left md:block">

                  <p className="font-semibold text-white">

                    <div className="flex items-center gap-2">
  <span>
    {profile?.full_name || "Quavron User"}
  </span>

  <VerificationBadge
    verified={profile?.verified}
    verificationType={profile?.verification_type}
    size={16}
  />
</div>
                  </p>


                  <p className="text-xs text-slate-400">

                    @{profile?.username || user?.email || "user"}

                  </p>

                </div>

              )}



              {!isMobile && (

                <ChevronDown
                  size={18}
                  className="text-slate-400"
                />

              )}

            </button>



            {openMenu && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-56
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
                    hover:bg-slate-800
                  "
                >
                  <User size={18}/>
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
                    hover:bg-slate-800
                  "
                >

                  <Settings size={18}/>
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
                    hover:bg-slate-800
                  "
                >

                  <LogOut size={18}/>
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

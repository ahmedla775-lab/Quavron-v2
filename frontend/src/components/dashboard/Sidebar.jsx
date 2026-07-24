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

import { useAuth } from "../auth/AuthProvider";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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

  const [open, setOpen] = useState(false);

  const {
    isDesktop,
  } = useResponsive();


  const {
    profile,
  } = useAuth();



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



  const showSidebar =
    isDesktop || open;



  return (

    <>

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

          <Menu size={22}/>

        </button>

      )}



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

            className="
              h-16
              w-auto
              object-contain
            "

          />


          {!isDesktop && (

            <button

              onClick={() => setOpen(false)}

              className="text-white"

            >

              <X size={24}/>

            </button>

          )}

        </div>



        <nav

          className="
            flex-1
            space-y-2
            overflow-y-auto
            p-4
          "

        >

          {navigation.map((item)=>{

            const Icon = item.icon;


            return (

              <NavLink

                key={item.path}

                to={item.path}

                onClick={() => {

                  if(!isDesktop){

                    setOpen(false);

                  }

                }}

                className={({isActive}) =>

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

                <Icon size={20}/>


                <span>

                  {t(`sidebar.${item.key}`)}

                </span>


              </NavLink>

            );

          })}

        </nav>


      </aside>



      {isDesktop && (

        <div className="w-72 shrink-0"/>

      )}


    </>

  );

}

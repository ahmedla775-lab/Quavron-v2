import {
  Home,
  Code2,
  Bot,
  Users,
  User,
} from "lucide-react";

import { NavLink } from "react-router-dom";


const items = [
  {
    name: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "IDE",
    path: "/ide",
    icon: Code2,
  },
  {
    name: "AI",
    path: "/ai",
    icon: Bot,
  },
  {
    name: "Community",
    path: "/community",
    icon: Users,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];


export default function MobileBottomNav() {

  return (

    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        flex
        h-16
        items-center
        justify-around
        border-t
        border-slate-800
        bg-slate-950/95
        backdrop-blur-lg
        md:hidden
      "
    >

      {items.map((item)=>{

        const Icon = item.icon;

        return (

          <NavLink
            key={item.path}
            to={item.path}
            className={({isActive}) =>
              `
              flex
              flex-col
              items-center
              justify-center
              gap-1
              text-xs
              transition

              ${
                isActive
                ? "text-blue-500"
                : "text-slate-400"
              }

              `
            }
          >

            <Icon size={22}/>

            <span>
              {item.name}
            </span>

          </NavLink>

        );

      })}

    </nav>

  );

}

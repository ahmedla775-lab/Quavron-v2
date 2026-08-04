import { NavLink } from "react-router-dom";
import { Menu, Bell, User } from "lucide-react";
import Button from "../ui/Button";
import { useState } from "react";


const navItems = [
  { name: "Home", path: "/" },
  { name: "IDE", path: "/ide" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Courses", path: "/courses" },
  { name: "Community", path: "/community" },
  { name: "Marketplace", path: "/marketplace" },
];


export default function Header() {

  const [open, setOpen] = useState(false);


  return (

    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-slate-800
        bg-slate-950/90
        backdrop-blur-lg
      "
    >

      <div
        className="
          flex
          h-16
          items-center
          px-4
          lg:px-6
        "
      >

        {/* Mobile Menu */}

        <div className="flex w-12 justify-start lg:hidden">

        <button
          className="
            flex
            text-slate-300
          "
          onClick={() => setOpen(!open)}
        >
          <Menu size={24}/>
        </button>

      </div>



        {/* Logo */}

        <NavLink
          to="/"
          className="
            flex-1
            text-center
            text-2xl
            font-extrabold
            tracking-tight
            text-[var(--q-primary)]
            lg:flex-none
          "
        >
          Quavron
        </NavLink>



        {/* Desktop Navigation */}

        <nav
          className="
            hidden
            items-center
            gap-8
            lg:flex
          "
        >

          {navItems.map((item)=>(

            <NavLink
              key={item.path}
              to={item.path}
              className={({isActive}) =>
                `
                transition
                ${
                  isActive
                  ? "text-[var(--q-primary)]"
                  : "text-slate-300 hover:text-white"
                }
                `
              }
            >
              {item.name}
            </NavLink>

          ))}

        </nav>



        {/* Actions */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <button
            className="
              lg:hidden
              text-slate-300
            "
          >
            <Bell size={21}/>
          </button>


          <NavLink
            to="/profile"
            className="
              lg:hidden
              text-slate-300
            "
          >
            <User size={21}/>
          </NavLink>


          <div className="hidden lg:flex gap-3">

            <NavLink to="/login">
              <Button variant="ghost">
                Login
              </Button>
            </NavLink>


            <NavLink to="/register">
              <Button>
                Get Started
              </Button>
            </NavLink>

          </div>


        </div>


      </div>



      {/* Mobile Menu Drawer */}

      {open && (

        <div
          className="
            absolute
            left-0
            right-0
            border-b
            border-slate-800
            bg-slate-950
            p-4
            lg:hidden
          "
        >

          <nav
            className="
              flex
              flex-col
              gap-3
            "
          >

            {navItems.map((item)=>(

              <NavLink
                key={item.path}
                to={item.path}
                onClick={()=>setOpen(false)}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-slate-300
                  hover:bg-slate-800
                "
              >
                {item.name}
              </NavLink>

            ))}

          </nav>

        </div>

      )}


    </header>

  );
}

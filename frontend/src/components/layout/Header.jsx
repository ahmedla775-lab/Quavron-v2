import { NavLink } from "react-router-dom";
import Button from "../ui/Button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "IDE", path: "/ide" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Courses", path: "/courses" },
  { name: "Community", path: "/community" },
  { name: "Marketplace", path: "/marketplace" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-lg">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <NavLink
          to="/"
          className="text-3xl font-extrabold tracking-tight text-blue-500"
        >
          Quavron
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? "text-blue-500"
                    : "text-slate-300 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </nav>

        <div className="flex items-center gap-3">

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

    </header>
  );
}


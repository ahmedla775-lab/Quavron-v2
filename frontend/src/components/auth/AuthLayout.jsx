import { NavLink } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        <NavLink
          to="/"
          className="mb-8 block text-center text-3xl font-extrabold text-blue-500"
        >
          Quavron
        </NavLink>

        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          {subtitle}
        </p>

        <div className="mt-8">

          {children}

        </div>

      </div>

    </div>
  );
}


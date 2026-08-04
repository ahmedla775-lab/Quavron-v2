import { NavLink } from "react-router-dom";
import navigation from "../data/navigation";

export default function QCCSidebar() {

  return (

    <div className="flex w-full flex-col">

      {/* Header */}

      <div
        className="
          border-b
          border-[var(--q-border)]
          px-6
          py-6
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            text-[var(--q-text)]
          "
        >
          QCC
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-[var(--q-muted)]
          "
        >
          Quavron Control Center
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6">

        <div className="space-y-2">

          {navigation.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  ${
                    isActive
                      ? "bg-[var(--q-primary)] text-white"
                      : "text-[var(--q-text)] hover:bg-[var(--q-card)]"
                  }
                `}
              >

                <Icon size={20} />

                <span className="font-medium">

                  {item.title}

                </span>

              </NavLink>

            );

          })}

        </div>

      </nav>

      {/* Footer */}

      <div
        className="
          border-t
          border-[var(--q-border)]
          px-6
          py-5
        "
      >

        <p
          className="
            text-xs
            text-[var(--q-muted)]
          "
        >
          Quavron Control Center
        </p>

        <p
          className="
            mt-1
            text-xs
            text-[var(--q-muted)]
          "
        >
          Internal Management Interface
        </p>

      </div>

    </div>

  );

}

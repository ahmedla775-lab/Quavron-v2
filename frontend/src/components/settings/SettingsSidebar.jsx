import { useAuth } from "../auth/AuthProvider";
import settingsMenu from "./settingsMenu";

export default function SettingsSidebar({
  selected,
  onSelect,
}) {

  const { user } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    "Quavron User";

  const avatar =
    user?.user_metadata?.avatar_url;

  return (

    <aside
      className="
        w-16
        md:w-80
        shrink-0
        overflow-y-auto
        border-r
        border-[var(--q-border)]
        bg-[var(--q-bg)]
      "
    >

      <div className="p-2 md:p-6">

        <h1
          className="
            hidden
            md:block
            mb-6
            text-2xl
            font-bold
            text-[var(--q-text)]
          "
        >
          Settings
        </h1>


        <div
          className="
            hidden
            md:block
            mb-8
            rounded-2xl
            border
            border-[var(--q-border)]
            bg-[var(--q-surface)]
            p-4
          "
        >

          <div className="flex items-center gap-4">

            {avatar ? (

              <img
                src={avatar}
                alt=""
                className="
                  h-14
                  w-14
                  rounded-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-600
                  text-lg
                  font-bold
                  text-[var(--q-text)]
                "
              >
                {fullName.charAt(0).toUpperCase()}
              </div>

            )}

            <div>

              <h2 className="font-semibold text-[var(--q-text)]">
                {fullName}
              </h2>

              <p className="text-sm text-[var(--q-muted)]">
                Account Center
              </p>

            </div>

          </div>

        </div>


        {settingsMenu.map((group) => (

          <div
            key={group.group}
            className="mb-3 md:mb-8"
          >

            <h3
              className="
                hidden
                md:block
                mb-3
                px-2
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              {group.group}
            </h3>


            <div className="space-y-1">

              {group.items.map((item) => {

                const Icon = item.icon;

                return (

                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={`
                      flex
                      w-full
                      items-center
                      justify-center
                      md:justify-start
                      gap-0
                      md:gap-4
                      rounded-xl
                      px-0
                      md:px-4
                      py-3
                      transition

                      ${
                        selected === item.id
                          ? "bg-cyan-500/15 text-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.35)] border border-cyan-400/30"
                          : "text-[var(--q-text)] hover:bg-[var(--q-surface)]"
                      }
                    `}
                  >

                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition-all
                        duration-300

                        ${
                          selected === item.id
                            ? "bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.45)]"
                            : "bg-[var(--q-card)]"
                        }
                      `}
                    >

                      <Icon size={20} />

                    </div>


                    <span
                      className="
                        hidden
                        md:block
                        text-sm
                        font-medium
                      "
                    >
                      {item.title}
                    </span>


                  </button>

                );

              })}

            </div>

          </div>

        ))}

      </div>

    </aside>

  );
}

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
        w-80
        shrink-0
        overflow-y-auto
        border-r
        border-slate-800
        bg-slate-950
      "
    >

      <div className="p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          Settings
        </h1>

        {/* Account Center */}

        <div
          className="
            mb-8
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
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
                  text-white
                "
              >

                {fullName.charAt(0).toUpperCase()}

              </div>

            )}

            <div>

              <h2 className="font-semibold text-white">

                {fullName}

              </h2>

              <p className="text-sm text-slate-400">

                Account Center

              </p>

            </div>

          </div>

        </div>

        {/* Groups */}

        {settingsMenu.map((group) => (

          <div
            key={group.group}
            className="mb-8"
          >

            <h3
              className="
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
                      gap-4
                      rounded-xl
                      px-4
                      py-3
                      transition

                      ${
                        selected === item.id
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-900"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-800
                      "
                    >

                      <Icon size={18} />

                    </div>

                    <span className="font-medium">

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

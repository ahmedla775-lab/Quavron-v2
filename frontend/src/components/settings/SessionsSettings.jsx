import { Monitor, Smartphone, LogOut } from "lucide-react";

const sessions = [

  {
    id: 1,
    device: "Current Device",
    type: "Desktop",
    browser: "Chrome",
    location: "Algeria",
    current: true,
  },

  {
    id: 2,
    device: "Android Phone",
    type: "Mobile",
    browser: "Chrome Mobile",
    location: "Algeria",
    current: false,
  },

];

export default function SessionsSettings() {

  return (

    <div className="space-y-5">

      {sessions.map((session) => (

        <div
          key={session.id}
          className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-slate-800 p-3">

              {session.type === "Desktop"

                ? <Monitor className="h-6 w-6 text-blue-400" />

                : <Smartphone className="h-6 w-6 text-blue-400" />

              }

            </div>

            <div>

              <h3 className="font-semibold text-white">

                {session.device}

              </h3>

              <p className="text-sm text-slate-400">

                {session.browser} • {session.location}

              </p>

              {session.current && (

                <span className="mt-2 inline-block rounded-full bg-green-600 px-3 py-1 text-xs text-white">

                  Current Session

                </span>

              )}

            </div>

          </div>

          {!session.current && (

            <button className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500">

              <LogOut className="h-4 w-4" />

              Logout

            </button>

          )}

        </div>

      ))}

      <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-600">

        Logout From All Devices

      </button>

    </div>

  );

}

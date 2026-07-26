import { useState } from "react";

export default function SecuritySettings() {

  const [passwords, setPasswords] = useState({
    current: "",
    password: "",
    confirm: "",
  });

  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    {
      id: 1,
      device: "Chrome - Windows",
      location: "Algeria",
      current: true,
    },
    {
      id: 2,
      device: "Android App",
      location: "Algeria",
      current: false,
    },
  ];

  function update(field, value) {

    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));

  }

  function changePassword() {

    alert("سيتم ربط تغيير كلمة المرور مع Supabase.");

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Password & Security

      </h1>

      <p className="mt-2 text-slate-400">

        Protect your Quavron account.

      </p>

      <div className="mt-10 space-y-10">

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Change Password

          </h2>

          <div className="space-y-5">

            <Input
              type="password"
              label="Current Password"
              value={passwords.current}
              onChange={(v)=>update("current",v)}
            />

            <Input
              type="password"
              label="New Password"
              value={passwords.password}
              onChange={(v)=>update("password",v)}
            />

            <Input
              type="password"
              label="Confirm Password"
              value={passwords.confirm}
              onChange={(v)=>update("confirm",v)}
            />

            <button
              onClick={changePassword}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Update Password
            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Two-Factor Authentication

          </h2>

          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5">

            <div>

              <p className="font-semibold text-white">

                Enable Two-Factor Authentication

              </p>

              <p className="mt-1 text-sm text-slate-400">

                Add an extra security layer.

              </p>

            </div>

            <button
              onClick={()=>setTwoFA(!twoFA)}
              className={`rounded-full px-5 py-2 font-semibold ${
                twoFA
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-white"
              }`}
            >

              {twoFA ? "Enabled" : "Disabled"}

            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-xl font-semibold text-white">

            Active Sessions

          </h2>

          <div className="space-y-4">

            {sessions.map((session)=>(

              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5"
              >

                <div>

                  <h3 className="font-semibold text-white">

                    {session.device}

                  </h3>

                  <p className="text-sm text-slate-400">

                    {session.location}

                  </p>

                </div>

                <div className="flex gap-3">

                  {session.current && (

                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs text-white">

                      Current

                    </span>

                  )}

                  {!session.current && (

                    <button className="rounded-xl bg-red-600 px-4 py-2 text-white">

                      Logout

                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

          <button className="mt-6 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white">

            Logout From All Devices

          </button>

        </section>

      </div>

    </div>

  );

}

function Input({

  label,
  value,
  onChange,
  type,

}){

  return(

    <div>

      <label className="mb-2 block text-slate-400">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white"
      />

    </div>

  );

}

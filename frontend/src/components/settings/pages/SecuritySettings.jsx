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

    <div className="mx-auto w-full max-w-5xl p-3 md:p-8 overflow-hidden">

      <h1 className="text-xl md:text-3xl font-bold text-[var(--q-text)]">

        Password & Security

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Protect your Quavron account.

      </p>

      <div className="mt-5 md:mt-10 space-y-5 md:space-y-10">

        <section>

          <h2 className="mb-5 text-base md:text-xl font-semibold text-[var(--q-text)]">

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
              className="rounded-xl bg-blue-600 px-3 md:px-6 py-3 font-semibold text-[var(--q-text)]"
            >
              Update Password
            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-base md:text-xl font-semibold text-[var(--q-text)]">

            Two-Factor Authentication

          </h2>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

            <div>

              <p className="font-semibold text-[var(--q-text)]">

                Enable Two-Factor Authentication

              </p>

              <p className="mt-1 text-xs md:text-sm text-[var(--q-muted)]">

                Add an extra security layer.

              </p>

            </div>

            <button
              onClick={()=>setTwoFA(!twoFA)}
              className={`rounded-full px-3 md:px-5 py-2 text-xs md:text-sm font-semibold ${
                twoFA
                  ? "bg-green-600 text-[var(--q-text)]"
                  : "bg-slate-700 text-[var(--q-text)]"
              }`}
            >

              {twoFA ? "Enabled" : "Disabled"}

            </button>

          </div>

        </section>

        <section>

          <h2 className="mb-5 text-base md:text-xl font-semibold text-[var(--q-text)]">

            Active Sessions

          </h2>

          <div className="space-y-4">

            {sessions.map((session)=>(

              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5"
              >

                <div>

                  <h3 className="font-semibold text-[var(--q-text)]">

                    {session.device}

                  </h3>

                  <p className="text-xs md:text-sm text-[var(--q-muted)]">

                    {session.location}

                  </p>

                </div>

                <div className="flex gap-3">

                  {session.current && (

                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs text-[var(--q-text)]">

                      Current

                    </span>

                  )}

                  {!session.current && (

                    <button className="rounded-xl bg-red-600 px-4 py-2 text-[var(--q-text)]">

                      Logout

                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

          <button className="mt-6 rounded-xl bg-red-700 px-3 md:px-6 py-3 font-semibold text-[var(--q-text)]">

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

      <label className="mb-2 block text-[var(--q-muted)]">

        {label}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 text-[var(--q-text)]"
      />

    </div>

  );

}

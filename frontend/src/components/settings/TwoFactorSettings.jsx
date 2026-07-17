import { ShieldCheck } from "lucide-react";

export default function TwoFactorSettings() {

  return (

    <div className="space-y-6">

      <div className="rounded-2xl border border-green-700 bg-green-900/20 p-6">

        <div className="flex items-center gap-4">

          <ShieldCheck className="h-10 w-10 text-green-400" />

          <div>

            <h2 className="text-xl font-semibold text-white">

              Two-Factor Authentication

            </h2>

            <p className="mt-1 text-slate-400">

              Protect your account with an additional verification step.

            </p>

          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h3 className="mb-4 text-lg font-semibold text-white">

          Status

        </h3>

        <span className="rounded-full bg-yellow-600 px-3 py-1 text-sm text-white">

          Disabled

        </span>

        <p className="mt-4 text-slate-400">

          Enable two-factor authentication using an Authenticator App
          (Google Authenticator, Microsoft Authenticator, Authy, etc.).

        </p>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Enable Two-Factor Authentication
        </button>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h3 className="mb-4 text-lg font-semibold text-white">

          Recovery Codes

        </h3>

        <p className="mb-4 text-slate-400">

          Recovery codes allow you to access your account if you lose your authentication device.

        </p>

        <button
          className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
        >
          Generate Recovery Codes
        </button>

      </div>

    </div>

  );

}

import {
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";

export default function DangerZoneSettings() {

  return (

    <div className="space-y-6">

      <div className="rounded-2xl border border-yellow-700 bg-yellow-950/20 p-6">

        <div className="flex items-center gap-4">

          <Download className="h-8 w-8 text-yellow-400" />

          <div>

            <h2 className="text-xl font-bold text-white">

              Export Your Data

            </h2>

            <p className="text-slate-400">

              Download a complete copy of your account, projects,
              posts, files and personal data.

            </p>

          </div>

        </div>

        <button
          className="mt-6 rounded-xl bg-yellow-600 px-6 py-3 font-semibold text-white transition hover:bg-yellow-500"
        >

          Export Data

        </button>

      </div>

      <div className="rounded-2xl border border-red-700 bg-red-950/20 p-6">

        <div className="flex items-center gap-4">

          <AlertTriangle className="h-8 w-8 text-red-400" />

          <div>

            <h2 className="text-xl font-bold text-white">

              Permanent Account Deletion

            </h2>

            <p className="text-slate-400">

              This action cannot be undone. All projects,
              posts, files, comments and account data
              will be permanently deleted.

            </p>

          </div>

        </div>

        <button
          className="mt-6 flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
        >

          <Trash2 className="h-5 w-5" />

          Delete Account

        </button>

      </div>

    </div>

  );

}

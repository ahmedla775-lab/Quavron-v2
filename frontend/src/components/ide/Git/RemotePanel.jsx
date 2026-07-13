import {
  Github,
  Upload,
  Download,
} from "lucide-react";

export default function RemotePanel() {
  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">

      <div className="mb-3 flex items-center gap-2">

        <Github size={18} />

        <span className="font-semibold">
          Remote Repository
        </span>

      </div>

      <div className="flex gap-2">

        <button className="flex-1 rounded-lg bg-blue-600 py-2 hover:bg-blue-700">

          <div className="flex items-center justify-center gap-2">

            <Upload size={17} />

            Push

          </div>

        </button>

        <button className="flex-1 rounded-lg bg-slate-700 py-2 hover:bg-slate-600">

          <div className="flex items-center justify-center gap-2">

            <Download size={17} />

            Pull

          </div>

        </button>

      </div>

    </div>
  );
}


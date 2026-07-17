import {
  Terminal,
  Trash2,
} from "lucide-react";

export default function TerminalPanel() {

  return (

    <div className="flex h-56 flex-col border-t border-slate-800 bg-slate-950">

      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">

        <div className="flex items-center gap-2">

          <Terminal className="h-4 w-4 text-green-400" />

          <span className="text-sm font-medium text-white">

            Terminal

          </span>

        </div>

        <button className="rounded p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white">

          <Trash2 className="h-4 w-4" />

        </button>

      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-sm text-green-400">

        <p>$ npm run dev</p>

        <p>VITE v5.4.21 ready in 1320 ms</p>

        <p>Local: http://localhost:5173/</p>

        <p className="mt-4">$ _</p>

      </div>

    </div>

  );

}

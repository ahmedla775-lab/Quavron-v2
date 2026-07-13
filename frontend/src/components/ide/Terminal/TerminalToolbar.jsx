import {
  Plus,
  Trash2,
  Maximize2,
} from "lucide-react";

export default function TerminalToolbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2">

      <span className="font-semibold text-white">
        Terminal
      </span>

      <div className="flex gap-2">

        <button className="rounded-md p-2 hover:bg-slate-800">
          <Plus size={17} />
        </button>

        <button className="rounded-md p-2 hover:bg-slate-800">
          <Trash2 size={17} />
        </button>

        <button className="rounded-md p-2 hover:bg-slate-800">
          <Maximize2 size={17} />
        </button>

      </div>

    </div>
  );
}


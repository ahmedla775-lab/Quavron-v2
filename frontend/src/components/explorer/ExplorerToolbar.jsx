import {
  FolderPlus,
  FilePlus,
  RefreshCw,
  Search,
} from "lucide-react";

export default function ExplorerToolbar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-3">

      <h2 className="font-bold text-white">
        Explorer
      </h2>

      <div className="flex gap-2">

        <button className="rounded-lg p-2 hover:bg-slate-800">
          <FilePlus size={18} />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-800">
          <FolderPlus size={18} />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-800">
          <Search size={18} />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-800">
          <RefreshCw size={18} />
        </button>

      </div>

    </div>
  );
}


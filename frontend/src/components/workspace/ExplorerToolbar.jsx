import {
  FilePlus2,
  FolderPlus,
  RefreshCw,
} from "lucide-react";

export default function ExplorerToolbar() {

  return (

    <div className="flex items-center justify-end gap-2 border-b border-slate-800 bg-slate-900 p-2">

      <button className="rounded p-2 hover:bg-slate-800">
        <FilePlus2 className="h-4 w-4 text-slate-300" />
      </button>

      <button className="rounded p-2 hover:bg-slate-800">
        <FolderPlus className="h-4 w-4 text-slate-300" />
      </button>

      <button className="rounded p-2 hover:bg-slate-800">
        <RefreshCw className="h-4 w-4 text-slate-300" />
      </button>

    </div>

  );

}

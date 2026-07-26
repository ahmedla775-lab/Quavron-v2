import { useState } from "react";
import {
  FilePlus2,
  FolderPlus,
  RefreshCw,
  Search,
} from "lucide-react";

import NewFileDialog from "./NewFileDialog";
import NewFolderDialog from "./NewFolderDialog";

import useExplorer from "../../modules/workspace/hooks/useExplorer";
import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function ExplorerToolbar() {

  const {
    search,
    setSearch,
  } = useExplorer();

  const {
    refresh,
  } = useWorkspace();

  const [newFileOpen, setNewFileOpen] =
    useState(false);

  const [newFolderOpen, setNewFolderOpen] =
    useState(false);

  return (

    <>

      <div className="border-b border-slate-800 bg-[#252526] p-3">

        <div className="mb-3 flex items-center justify-between">

          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">

            Workspace

          </span>

          <div className="flex items-center gap-1">

            <button
              onClick={() => setNewFileOpen(true)}
              className="rounded p-2 hover:bg-slate-700"
            >
              <FilePlus2 className="h-4 w-4 text-slate-300"/>
            </button>

            <button
              onClick={() => setNewFolderOpen(true)}
              className="rounded p-2 hover:bg-slate-700"
            >
              <FolderPlus className="h-4 w-4 text-slate-300"/>
            </button>

            <button
              onClick={refresh}
              className="rounded p-2 hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4 text-slate-300"/>
            </button>

          </div>

        </div>

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/>

          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-sky-500"
          />

        </div>

      </div>

      <NewFileDialog
        open={newFileOpen}
        onClose={() => setNewFileOpen(false)}
      />

      <NewFolderDialog
        open={newFolderOpen}
        onClose={() => setNewFolderOpen(false)}
      />

    </>

  );

}

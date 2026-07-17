import {
  FilePlus2,
  FolderPlus,
  RefreshCw,
  Search,
} from "lucide-react";

import useExplorer from "../../modules/workspace/hooks/useExplorer";
import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function ExplorerToolbar() {

  const {

    search,
    setSearch,

  } = useExplorer();

  const {

    selectedNodeId,
    createFile,
    createFolder,
    refresh,

  } = useWorkspace();

  function handleNewFile() {

    const name = prompt("File name");

    if (!name) return;

    createFile(

      selectedNodeId,

      name,

      {

        language: "javascript",

      }

    );

  }

  function handleNewFolder() {

    const name = prompt("Folder name");

    if (!name) return;

    createFolder(

      selectedNodeId,

      name

    );

  }

  return (

    <div className="border-b border-slate-800 bg-slate-900 p-2">

      <div className="mb-2 flex items-center gap-2">

        <button

          onClick={handleNewFile}

          className="rounded p-2 hover:bg-slate-800"

        >

          <FilePlus2 className="h-4 w-4 text-slate-300" />

        </button>

        <button

          onClick={handleNewFolder}

          className="rounded p-2 hover:bg-slate-800"

        >

          <FolderPlus className="h-4 w-4 text-slate-300" />

        </button>

        <button

          onClick={refresh}

          className="rounded p-2 hover:bg-slate-800"

        >

          <RefreshCw className="h-4 w-4 text-slate-300" />

        </button>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <input

          value={search}

          onChange={(e) =>

            setSearch(e.target.value)

          }

          placeholder="Search..."

          className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-blue-500"

        />

      </div>

    </div>

  );

}

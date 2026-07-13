import { useState } from "react";
import {
  FolderPlus,
  FilePlus,
  RefreshCw,
  Search,
} from "lucide-react";

import { useFiles } from "../../../context/FileContext";

import NewFileDialog from "../Dialog/NewFileDialog";
import NewFolderDialog from "../Dialog/NewFolderDialog";

export default function ExplorerToolbar() {

  const [showNewFile, setShowNewFile] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);

  const {
    createFile,
    createFolder,
  } = useFiles();

  async function handleCreateFile(name) {

    try {

      await createFile(name);

      setShowNewFile(false);

    } catch (err) {

      alert(err.message);

    }

  }

  async function handleCreateFolder(name) {

    try {

      await createFolder(name);

      setShowNewFolder(false);

    } catch (err) {

      alert(err.message);

    }

  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 p-3">

        <h2 className="font-bold text-white">
          Explorer
        </h2>

        <div className="flex gap-2">

          <button
            onClick={() => setShowNewFile(true)}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
            <FilePlus size={18} />
          </button>

          <button
            onClick={() => setShowNewFolder(true)}
            className="rounded-lg p-2 hover:bg-slate-800"
          >
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

      <NewFileDialog
        open={showNewFile}
        onClose={() => setShowNewFile(false)}
        onCreate={handleCreateFile}
      />

      <NewFolderDialog
        open={showNewFolder}
        onClose={() => setShowNewFolder(false)}
        onCreate={handleCreateFolder}
      />
    </>
  );
}

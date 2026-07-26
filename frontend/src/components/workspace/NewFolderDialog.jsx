import { useEffect, useState } from "react";

import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function NewFolderDialog({
  open,
  onClose,
}) {

  const [name, setName] = useState("");

  const {
    selectedNodeId,
    createFolder,
  } = useWorkspace();

  useEffect(() => {
    if (open) {
      setName("");
    }
  }, [open]);

  if (!open) return null;

  function handleCreate() {

    if (!name.trim()) return;

    createFolder(
      selectedNodeId,
      name.trim()
    );

    onClose();

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-96 rounded-xl border border-slate-700 bg-slate-900 p-6">

        <h2 className="mb-5 text-lg font-semibold text-white">
          New Folder
        </h2>

        <input
          autoFocus
          value={name}
          onChange={(e)=>setName(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
              handleCreate();
            }
          }}
          placeholder="components"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-sky-500"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-500"
          >
            Create
          </button>

        </div>

      </div>

    </div>

  );

}

import { useState } from "react";

export default function NewFolderDialog({
  open,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");

  if (!open) return null;

  function handleCreate() {
    if (!name.trim()) return;

    onCreate(name.trim());

    setName("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-96 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

        <h2 className="mb-5 text-2xl font-bold text-white">
          New Folder
        </h2>

        <input
          autoFocus
          type="text"
          value={name}
          placeholder="Folder name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreate();
            }
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={() => {
              setName("");
              onClose();
            }}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Create Folder
          </button>

        </div>

      </div>

    </div>
  );
}

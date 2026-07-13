import { useState } from "react";

export default function NewFileDialog({
  open,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-96 rounded-xl bg-slate-900 p-6">

        <h2 className="mb-4 text-xl font-bold text-white">
          New File
        </h2>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="example.jsx"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onCreate(name);
              setName("");
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Create
          </button>

        </div>

      </div>

    </div>
  );
}

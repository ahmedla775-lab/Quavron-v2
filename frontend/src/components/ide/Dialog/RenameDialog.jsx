import { useEffect, useState } from "react";

export default function RenameDialog({
  open,
  value,
  onClose,
  onSave,
}) {

  const [name, setName] = useState("");

  useEffect(() => {

    setName(value || "");

  }, [value]);

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-96 rounded-xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="mb-5 text-2xl font-bold text-white">

          Rename

        </h2>

        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(name)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );

}

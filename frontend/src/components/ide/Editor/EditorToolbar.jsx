export default function EditorToolbar({

  saving = false,

}) {

  return (

    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2">

      <div className="text-sm text-slate-300">

        Editor

      </div>

      <div
        className={`text-sm font-medium ${
          saving
            ? "text-amber-400"
            : "text-emerald-400"
        }`}
      >

        {saving ? "Saving..." : "Saved"}

      </div>

    </div>

  );

}

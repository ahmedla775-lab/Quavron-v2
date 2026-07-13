export default function ContextMenu() {

  return (

    <div className="absolute z-50 w-52 rounded-lg border border-slate-800 bg-slate-900 shadow-xl">

      <button className="w-full px-4 py-3 text-left hover:bg-slate-800">
        New File
      </button>

      <button className="w-full px-4 py-3 text-left hover:bg-slate-800">
        New Folder
      </button>

      <button className="w-full px-4 py-3 text-left hover:bg-slate-800">
        Rename
      </button>

      <button className="w-full px-4 py-3 text-left hover:bg-slate-800">
        Delete
      </button>

    </div>

  );

}


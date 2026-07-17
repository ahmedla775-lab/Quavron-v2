export default function ContextMenu() {

  return (

    <div className="absolute w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl">

      <button className="block w-full px-4 py-3 text-left text-white hover:bg-slate-800">

        New File

      </button>

      <button className="block w-full px-4 py-3 text-left text-white hover:bg-slate-800">

        New Folder

      </button>

      <button className="block w-full px-4 py-3 text-left text-white hover:bg-slate-800">

        Rename

      </button>

      <button className="block w-full px-4 py-3 text-left text-red-400 hover:bg-slate-800">

        Delete

      </button>

    </div>

  );

}

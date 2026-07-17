export default function DeleteDialog({ open, onClose }) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/60">

      <div className="w-96 rounded-2xl bg-slate-900 p-6">

        <h2 className="text-xl font-bold text-white">

          Delete Item

        </h2>

        <p className="mt-4 text-slate-400">

          Are you sure?

        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-5 py-2 text-white">

            Cancel

          </button>

          <button
            className="rounded-xl bg-red-600 px-5 py-2 text-white">

            Delete

          </button>

        </div>

      </div>

    </div>

  );

}

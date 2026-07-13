export default function FileContextMenu({
  open,
  x,
  y,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
}) {

  if (!open) return null;

  return (
    <div
      className="fixed z-50 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl"
      style={{
        left: x,
        top: y,
      }}
    >

      <button
        onClick={() => {
          onNewFile();
          onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-slate-800"
      >
        📄 New File
      </button>

      <button
        onClick={() => {
          onNewFolder();
          onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-slate-800"
      >
        📁 New Folder
      </button>

      <button
        onClick={() => {
          onRename();
          onClose();
        }}
        className="w-full px-4 py-3 text-left hover:bg-slate-800"
      >
        ✏ Rename
      </button>

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-800"
      >
        🗑 Delete
      </button>

    </div>
  );
}

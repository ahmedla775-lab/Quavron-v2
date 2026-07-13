export default function EmptyEditor() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-950 text-slate-400">
      <div className="text-center">

        <h2 className="mb-2 text-2xl font-bold text-white">
          No File Open
        </h2>

        <p>
          Select a file from the Explorer to start editing.
        </p>

      </div>
    </div>
  );
}

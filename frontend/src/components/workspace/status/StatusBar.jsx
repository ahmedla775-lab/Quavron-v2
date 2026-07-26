export default function StatusBar() {
  return (
    <div className="flex h-7 items-center justify-between border-t border-slate-800 bg-sky-700 px-4 text-xs text-white">

      <div className="flex gap-4">

        <span>main</span>

        <span>UTF-8</span>

        <span>React</span>

      </div>

      <div className="flex gap-4">

        <span>Ln 1</span>

        <span>Col 1</span>

        <span>Spaces:2</span>

      </div>

    </div>
  );
}

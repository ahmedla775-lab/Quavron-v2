const KEYS = [
  "Tab",
  "{",
  "}",
  "(",
  ")",
  "[",
  "]",
  "<",
  ">",
  "=",
  "=>",
  ";",
  ":",
  "\"",
  "'",
  "/",
  "\\",
  "@",
  "#",
  "$",
];

export default function MobileEditorToolbar({
  onInsert,
}) {
  return (
    <div className="flex overflow-x-auto border-t border-slate-800 bg-slate-900 p-2 gap-2">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onInsert(key)}
          className="min-w-[44px] rounded bg-slate-800 px-3 py-2 text-sm text-white active:bg-slate-700"
        >
          {key}
        </button>
      ))}
    </div>
  );
}

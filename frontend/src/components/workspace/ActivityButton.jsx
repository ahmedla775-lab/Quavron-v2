export default function ActivityButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative flex h-12 w-12 items-center justify-center transition ${
        active
          ? "bg-slate-800 text-sky-400"
          : "text-slate-500 hover:bg-slate-900 hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 h-8 w-1 rounded-r bg-sky-500" />
      )}

      <Icon className="h-6 w-6" />

      <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg bg-slate-950 px-3 py-2 text-sm text-white opacity-0 shadow-xl transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

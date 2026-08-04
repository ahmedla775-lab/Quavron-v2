import { Search, ArrowLeft } from "lucide-react";

export default function SettingsSearch({
  value,
  onChange,
  onBack,
}) {
  return (
    <div className="sticky top-0 z-20 border-b border-[var(--q-border)] bg-[var(--q-bg)] p-4">

      <div className="flex items-center gap-3">

        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden rounded-lg p-2 hover:bg-[var(--q-card)]"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={value}
            onChange={(e)=>onChange(e.target.value)}
            placeholder="Search settings..."
            className="w-full rounded-xl border border-slate-700 bg-[var(--q-surface)] py-3 pl-10 pr-4 text-[var(--q-text)] outline-none focus:border-blue-500"
          />

        </div>

      </div>

    </div>
  );
}

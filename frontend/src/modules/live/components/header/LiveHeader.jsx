import { Radio } from "lucide-react";

export default function LiveHeader({
  title = "Untitled Live",
  viewers = 0,
  duration = "00:00",
  quality = "480p",
}) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--q-border)] bg-[var(--q-card)] px-5 py-4">

      <div>
        <h2 className="text-lg font-bold text-[var(--q-text)]">
          {title}
        </h2>

        <div className="mt-2 flex items-center gap-4 text-sm text-[var(--q-muted)]">

          <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-white">
            <Radio size={14} />
            LIVE
          </span>

          <span>{viewers} viewers</span>

          <span>{duration}</span>

          <span>{quality}</span>

        </div>
      </div>

    </header>
  );
}

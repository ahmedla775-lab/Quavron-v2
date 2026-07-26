import { ChevronRight } from "lucide-react";

export default function SettingsItem({
  title,
  description = "",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between
        border-b
        border-slate-800
        px-5
        py-4
        text-left
        transition
        hover:bg-slate-900
      "
    >
      <div className="min-w-0">

        <h3 className="font-medium text-white">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-slate-400">
            {description}
          </p>
        )}

      </div>

      <ChevronRight
        size={20}
        className="text-slate-500"
      />

    </button>
  );
}

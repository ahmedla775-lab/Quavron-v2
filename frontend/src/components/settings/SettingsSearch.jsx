import { Search } from "lucide-react";

export default function SettingsSearch({
  value,
  onChange,
}) {
  return (
    <div className="border-b border-slate-800 p-5">

      <div className="relative">

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search settings..."
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            py-3
            pl-11
            pr-4
            text-white
            outline-none
            transition
            focus:border-blue-500
          "
        />

      </div>

    </div>
  );
}

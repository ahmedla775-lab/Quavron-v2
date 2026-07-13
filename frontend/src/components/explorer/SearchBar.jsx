import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="border-b border-slate-800 bg-slate-950 p-3">

      <div className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2">

        <Search size={16} />

        <input
          className="w-full bg-transparent text-white outline-none"
          placeholder="Search..."
        />

      </div>

    </div>
  );
}


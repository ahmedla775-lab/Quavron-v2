import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="border-b border-slate-800 p-3">

      <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2">

        <Search size={16} />

        <input
          type="text"
          placeholder="Search files..."
          className="w-full bg-transparent text-white outline-none"
        />

      </div>

    </div>
  );
}


import { GitBranch } from "lucide-react";

export default function BranchSelector() {
  return (
    <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">

      <GitBranch size={18} />

      <select className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-white outline-none">

        <option>main</option>
        <option>development</option>

      </select>

    </div>
  );
}


import {
  ChevronRight,
} from "lucide-react";

export default function Breadcrumbs() {

  return (

    <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-5 py-2 text-sm text-slate-400">

      <span>src</span>

      <ChevronRight className="h-4 w-4" />

      <span>components</span>

      <ChevronRight className="h-4 w-4" />

      <span className="text-white">

        EditorArea.jsx

      </span>

    </div>

  );

}

import { Bot } from "lucide-react";

export default function AIHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">

      <Bot size={22} />

      <div>

        <h2 className="font-bold text-white">
          Quavron AI
        </h2>

        <p className="text-sm text-slate-400">
          Your intelligent coding assistant
        </p>

      </div>

    </div>
  );
}


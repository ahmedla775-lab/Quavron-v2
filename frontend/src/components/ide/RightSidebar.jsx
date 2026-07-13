import { Bot } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

export default function RightSidebar() {
  return (
    <div className="h-full p-4">

      <Card>

        <div className="flex items-center gap-3">

          <Bot
            size={30}
            className="text-blue-500"
          />

          <div>

            <h2 className="text-xl font-bold text-white">
              AI Assistant
            </h2>

            <p className="text-sm text-slate-400">
              Ask AI about your code.
            </p>

          </div>

        </div>

        <textarea
          className="mt-6 h-48 w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none"
          placeholder="Ask Quavron AI..."
        />

        <Button
          className="mt-4 w-full"
        >
          Send
        </Button>

      </Card>

    </div>
  );
}


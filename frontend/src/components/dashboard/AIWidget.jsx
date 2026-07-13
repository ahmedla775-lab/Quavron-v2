import { Bot, Sparkles } from "lucide-react";

import Card from "../ui/Card";
import Button from "../ui/Button";

export default function AIWidget() {
  return (
    <Card>

      <div className="flex items-center gap-3">

        <Bot
          size={32}
          className="text-blue-500"
        />

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Assistant
          </h2>

          <p className="text-slate-400">
            Your intelligent coding companion.
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5">

        <p className="leading-7 text-slate-300">

          Ask Quavron AI to generate code,
          explain algorithms,
          fix bugs,
          optimize performance,
          create documentation
          or build complete applications.

        </p>

      </div>

      <div className="mt-8 flex gap-4">

        <Button>

          <Sparkles size={18} />

          Open AI

        </Button>

        <Button variant="outline">

          History

        </Button>

      </div>

    </Card>
  );
}


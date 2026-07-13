import { useState } from "react";

import { Send } from "lucide-react";

export default function AIInput({ onSend }) {

  const [text, setText] = useState("");

  function handleSubmit() {

    if (!text.trim()) return;

    onSend(text);

    setText("");

  }

  return (

    <div className="border-t border-slate-800 bg-slate-900 p-4">

      <div className="flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Ask Quavron AI..."
          className="flex-1 rounded-lg bg-slate-800 px-4 py-3 text-white outline-none"
        />

        <button
          onClick={handleSubmit}
          className="rounded-lg bg-blue-600 px-4 hover:bg-blue-700"
        >
          <Send size={18} />
        </button>

      </div>

    </div>

  );

}


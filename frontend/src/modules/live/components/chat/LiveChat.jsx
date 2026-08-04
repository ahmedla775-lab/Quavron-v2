import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function LiveChat({
  messages = [],
  onSend,
}) {

  const [text, setText] = useState("");

  function handleSend() {

    if (!text.trim()) return;

    onSend?.(text);

    setText("");

  }

  return (

    <div className="flex h-full flex-col">

      <div className="border-b border-[var(--q-border)] p-4">

        <h2 className="font-semibold text-[var(--q-text)]">
          Live Chat
        </h2>

      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 ? (

          <p className="text-sm text-[var(--q-muted)]">
            No messages yet.
          </p>

        ) : (

          messages.map((message) => (

            <div key={message.id}>

              <span className="font-semibold">
                {message.user}
              </span>

              <span className="ml-2">
                {message.message}
              </span>

            </div>

          ))

        )}

      </div>

      <div className="border-t border-[var(--q-border)] p-3">

        <div className="flex gap-2">

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="
              flex-1
              rounded-xl
              border
              border-[var(--q-border)]
              bg-[var(--q-bg)]
              px-4
              py-2
              outline-none
            "
          />

          <button
            onClick={handleSend}
            className="
              rounded-xl
              bg-[var(--q-primary)]
              px-4
              text-white
            "
          >
            <SendHorizontal size={18}/>
          </button>

        </div>

      </div>

    </div>

  );

}

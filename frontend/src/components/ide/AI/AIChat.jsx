import { useState } from "react";

import AIHeader from "./AIHeader";
import AIHistory from "./AIHistory";
import AIInput from "./AIInput";

export default function AIChat() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      message: "Hello 👋 I'm Quavron AI. How can I help you today?",
    },
  ]);

  function handleSend(text) {

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        message: text,
      },
    ]);

  }

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <AIHeader />

      <AIHistory messages={messages} />

      <AIInput onSend={handleSend} />

    </div>

  );

}


import { useState } from "react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";

export default function AIChat() {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function send() {

    if (!input) return;

    const prompt = input;

    setMessages(prev => [
      ...prev,
      {
        role: "user",
        message: prompt
      }
    ]);

    setInput("");

    try {

      const result = await AIService.ask(prompt);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          message:
            result?.llm?.answer ??
            result?.answer ??
            result?.response ??
            "No response from AI."
        }
      ]);

    } catch (e) {

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          message: "Connection error with Quavron AI"
        }
      ]);

    }

  }

  return (
    <div className="ai-chat">

      <div className="ai-messages">
        {messages.map((m, i) => (
          <AIMessage
            key={i}
            role={m.role}
            message={m.message}
          />
        ))}
      </div>

      <div>

        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Quavron AI..."
        />

        <button onClick={send}>
          Send
        </button>

      </div>

    </div>
  );
}

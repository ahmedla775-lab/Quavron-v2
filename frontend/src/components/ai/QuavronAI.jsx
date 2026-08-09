import { useState } from "react";
import AIService from "../../services/AIService";

export default function QuavronAI() {

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);


  async function send() {

    if (!message.trim()) return;

    setLoading(true);

    try {

      const result = await AIService.ask(message);

      setResponse(result);

    } catch (error) {

      console.error("QUAVRON AI ERROR:", error);

      setResponse({
        answer: error?.message || "Connection error with Quavron AI"
      });

    }

    setLoading(false);

  }


  return (
    <section className="
      rounded-3xl
      p-6
      bg-white/60
      dark:bg-slate-950/60
      border
      border-white/20
      shadow-sm
    ">

      <h2 className="text-2xl font-black mb-4">
        Quavron AI
      </h2>


      <div className="flex gap-3">

        <input
          className="
          flex-1
          rounded-xl
          border
          p-3
          bg-transparent
          "
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Ask Quavron AI..."
        />


        <button
          onClick={send}
          className="
          px-5
          rounded-xl
          bg-blue-600
          text-white
          "
        >
          Send
        </button>

      </div>


      {loading && (
        <div className="mt-4">
          Thinking...
        </div>
      )}


      {response && (
        <div className="
          mt-5
          rounded-xl
          p-4
          bg-black/5
          dark:bg-white/5
        ">

          <p className="font-bold">
            {response.agent && `Agent: ${response.agent}`}
          </p>

          <p className="mt-2">
            {response.llm?.answer || response.answer || response.message}
          </p>

        </div>
      )}

    </section>
  );
}

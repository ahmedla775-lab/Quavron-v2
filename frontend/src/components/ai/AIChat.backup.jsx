import { useState } from "react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";

export default function AIChat() {

  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([]);
  const [loading,setLoading] = useState(false);

  async function send(){

    if(!input.trim()) return;

    const prompt=input;

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        message:prompt
      }
    ]);

    setInput("");
    setLoading(true);

    try{

      const result = await AIService.ask(prompt);

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          message:
          result?.llm?.answer ??
          result?.answer ??
          "No response"
        }
      ]);

    }catch{

      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          message:"Connection error with Quavron AI"
        }
      ]);

    }

    setLoading(false);

  }


  return (

    <section
      className="
      rounded-3xl
      border
      border-white/40
      bg-white/70
      backdrop-blur-xl
      shadow-2xl
      dark:bg-slate-900/70
      dark:border-blue-900
      p-6
      min-h-[600px]
      flex
      flex-col
      "
    >

      <div className="
        flex-1
        space-y-4
        overflow-y-auto
        mb-5
      ">

        {messages.map((m,i)=>(
          <AIMessage
            key={i}
            role={m.role}
            message={m.message}
          />
        ))}


        {loading && (
          <div className="
            text-blue-600
            dark:text-blue-300
            font-bold
          ">
            Quavron AI is thinking...
          </div>
        )}

      </div>


      <div className="
        flex
        gap-3
        bg-white/80
        dark:bg-black/40
        rounded-2xl
        p-3
      ">

        <input

          className="
          flex-1
          bg-transparent
          outline-none
          px-4
          text-slate-900
          dark:text-white
          "

          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask Quavron AI..."

          onKeyDown={(e)=>{
            if(e.key==="Enter")
              send();
          }}

        />


        <button

          onClick={send}

          className="
          px-6
          rounded-xl
          bg-blue-700
          hover:bg-blue-800
          text-white
          font-bold
          "

        >
          Send

        </button>

      </div>


    </section>

  );

}


import { useState } from "react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";

export default function AIChat() {

  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([]);

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
          message:"Connection error"
        }
      ]);

    }

  }


  return (

    <div
      className="
        h-full
        flex
        flex-col
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white/70
        dark:bg-black/40
        backdrop-blur
        overflow-hidden
      "
    >

      <div
        className="
          flex-1
          overflow-y-auto
          p-3
          sm:p-5
          space-y-3
        "
      >

        {messages.map((m,i)=>(

          <AIMessage
            key={i}
            role={m.role}
            message={m.message}
          />

        ))}

      </div>


      <div
        className="
          p-3
          border-t
          border-slate-200
          dark:border-slate-800
          flex
          gap-2
          bg-gradient-to-r
          from-white
          via-sky-50
          to-blue-100
          dark:from-slate-950
          dark:via-black
          dark:to-blue-950
        "
      >

        <input

          className="
            flex-1
            rounded-2xl
            px-4
            py-3
            outline-none
            bg-white
            dark:bg-slate-950
            text-slate-900
            dark:text-white
          "

          value={input}

          onChange={
            e=>setInput(e.target.value)
          }

          placeholder="Ask Quavron AI..."

          onKeyDown={
            e=>{
              if(e.key==="Enter")
                send()
            }
          }

        />


        <button

          onClick={send}

          className="
            shrink-0
            px-4
            sm:px-5
            rounded-2xl
            bg-blue-600
            text-white
            font-bold
          "

        >
          Send

        </button>


      </div>


    </div>

  );

}

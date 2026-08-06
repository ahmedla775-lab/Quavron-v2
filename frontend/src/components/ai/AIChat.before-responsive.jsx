import { useState } from "react";
import { Paperclip, Image, Video, Send } from "lucide-react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";


export default function AIChat(){

  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);
  const [loading,setLoading]=useState(false);


  async function send(){

    if(!input.trim()) return;


    const question=input;

    setMessages(prev=>[
      ...prev,
      {
        role:"user",
        message:question
      }
    ]);


    setInput("");
    setLoading(true);


    try{

      const result =
        await AIService.ask(question);


      setMessages(prev=>[
        ...prev,
        {
          role:"assistant",
          message:
          result?.llm?.answer ||
          result?.answer ||
          result?.message ||
          "No response"
        }
      ]);


    }catch(error){

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
      min-h-[650px]
      flex
      flex-col
      rounded-3xl
      border
      border-[var(--q-border)]
      bg-[var(--q-surface)]
      shadow-xl
      overflow-hidden
      "
    >


      <div
        className="
        flex-1
        overflow-y-auto
        p-6
        space-y-4
        "
      >

        {messages.map((item,index)=>(

          <AIMessage
            key={index}
            role={item.role}
            message={item.message}
          />

        ))}


        {loading && (

          <div
            className="
            text-[var(--q-primary)]
            font-bold
            "
          >
            Quavron AI thinking...
          </div>

        )}

      </div>



      <div
        className="
        p-4
        border-t
        border-[var(--q-border)]
        bg-[var(--q-card)]
        "
      >


        <div
          className="
          flex
          items-center
          gap-2
          rounded-2xl
          border
          border-[var(--q-border)]
          px-3
          py-2
          bg-[var(--q-surface)]
          "
        >


          <button className="text-[var(--q-muted)]">
            <Paperclip size={20}/>
          </button>


          <button className="text-[var(--q-muted)]">
            <Image size={20}/>
          </button>


          <button className="text-[var(--q-muted)]">
            <Video size={20}/>
          </button>



          <input

            className="
            flex-1
            bg-transparent
            outline-none
            text-[var(--q-text)]
            px-2
            "

            value={input}
            onChange={(e)=>setInput(e.target.value)}

            onKeyDown={(e)=>{
              if(e.key==="Enter")
                send();
            }}

            placeholder="Ask Quavron AI..."

          />


          <button

            onClick={send}

            className="
            rounded-xl
            p-3
            bg-[var(--q-primary)]
            text-white
            hover:opacity-90
            "

          >

            <Send size={18}/>

          </button>


        </div>


      </div>


    </section>

  );

}

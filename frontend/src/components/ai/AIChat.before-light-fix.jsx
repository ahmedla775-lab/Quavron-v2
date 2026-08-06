import { useState } from "react";
import { Plus, Send, FileText, Image, Video, Paperclip } from "lucide-react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";

export default function AIChat() {

  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([]);
  const [menu,setMenu] = useState(false);
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

    <div
      className="
      flex
      flex-col
      h-[calc(100vh-180px)]
      min-h-[420px]
      rounded-3xl
      overflow-hidden
      border
      border-[var(--q-border)]
      bg-gradient-to-br from-white via-cyan-50 to-blue-100
      dark:bg-slate-950/80
      backdrop-blur-xl
      "
    >


      <div
        className="
        flex-1
        overflow-y-auto
        p-4
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


        {loading && (

          <div className="
          text-sm
          text-slate-500
          dark:text-slate-400
          ">
            Quavron AI is thinking...
          </div>

        )}

      </div>



      <div
        className="
        relative
        p-3
        border-t
        border-[var(--q-border)]
        bg-gradient-to-r
        from-[var(--q-surface)]
        via-cyan-50
        to-blue-200
        dark:from-slate-950
        dark:via-slate-900
        dark:to-blue-950
        "
      >


        {menu && (

          <div
            className="
            absolute
            bottom-20
            left-4
            rounded-2xl
            p-2
            shadow-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white/90
            dark:bg-slate-900/80
            space-y-1
            "
          >

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <FileText size={18}/>
              File
            </button>


            <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Image size={18}/>
              Image
            </button>


            <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Video size={18}/>
              Video
            </button>


            <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <Paperclip size={18}/>
              Attachment
            </button>

          </div>

        )}




        <div
          className="
          flex
          items-end
          gap-2
          "
        >


          <button
            onClick={()=>setMenu(!menu)}
            className="
            w-11
            h-11
            shrink-0
            rounded-full
            flex
            items-center
            justify-center
            bg-sky-600
            text-white
            shadow-lg
            "
          >

            <Plus size={24}/>

          </button>



          <textarea

            value={input}

            onChange={
              e=>setInput(e.target.value)
            }

            rows="1"

            className="
            flex-1
            resize-none
            rounded-2xl
            px-4
            py-3
            max-h-32
            outline-none
            bg-white/95
            dark:bg-slate-950
            text-slate-900
            dark:text-white
            border
            border-slate-200
            dark:border-slate-700
            "

            placeholder="Ask Quavron AI..."

            onKeyDown={
              e=>{

                if(
                  e.key==="Enter"
                  &&
                  !e.shiftKey
                ){

                  e.preventDefault();
                  send();

                }

              }
            }

          />



          <button

            onClick={send}

            className="
            w-11
            h-11
            shrink-0
            rounded-full
            flex
            items-center
            justify-center
            bg-blue-700
            text-white
            shadow-lg
            "

          >

            <Send size={20}/>

          </button>


        </div>


      </div>


    </div>

  );

}

import { useState } from "react";
import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";


export default function AIChat(){

  const [input,setInput] = useState("");
  const [messages,setMessages] = useState([]);


  async function send(){

    if(!input) return;


    const user = {
      role:"user",
      message:input
    };


    setMessages(prev=>[
      ...prev,
      user
    ]);


    const result = await AIService.ask(input);


    setMessages(prev=>[
      ...prev,
      {
        role:"assistant",
        message:result.answer || JSON.stringify(result)
      }
    ]);


    setInput("");

  }



  return (

    <div className="ai-chat">

      <div className="ai-messages">

        {
          messages.map((m,i)=>(

            <AIMessage
              key={i}
              role={m.role}
              message={m.message}
            />

          ))
        }

      </div>


      <div>

        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder="Ask Quavron AI..."
        />


        <button onClick={send}>
          Send
        </button>

      </div>


    </div>

  );

}

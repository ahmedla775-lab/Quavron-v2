
import { useState } from "react";
import {
  Paperclip,
  Image,
  Video,
  Send
} from "lucide-react";

import AIService from "../../services/AIService";
import AIMessage from "./AIMessage";


export default function AIChat(){

  const [input,setInput]=useState("");
  const [messages,setMessages]=useState([]);
  const [files,setFiles]=useState([]);


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

      const result=await AIService.ask(prompt);


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



  function handleFiles(e){

    setFiles([
      ...files,
      ...Array.from(e.target.files)
    ]);

  }



  return (

<div

className="
h-full
flex
flex-col
rounded-3xl
overflow-hidden

bg-gradient-to-b
from-white
via-sky-50
to-blue-100

dark:from-black
dark:via-slate-950
dark:to-blue-950

border
border-slate-200
dark:border-blue-900

shadow-xl
"

>


<div

className="
flex-1
overflow-y-auto
p-4
space-y-4
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
border-t
p-3

bg-white/80
dark:bg-black/60

backdrop-blur

"

>


{files.length>0 &&

<div className="
text-xs
mb-2
text-slate-500
">

{files.length} file selected

</div>

}



<div

className="
flex
items-center
gap-2
"

>


<label

className="
p-2
rounded-xl
cursor-pointer
hover:bg-blue-100
dark:hover:bg-blue-900
"

>

<Paperclip size={20}/>

<input

type="file"

multiple

className="hidden"

onChange={handleFiles}

/>

</label>



<label

className="
p-2
rounded-xl
cursor-pointer
hover:bg-blue-100
dark:hover:bg-blue-900
"

>

<Image size={20}/>

<input

type="file"

accept="image/*"

className="hidden"

/>

</label>



<label

className="
p-2
rounded-xl
cursor-pointer
hover:bg-blue-100
dark:hover:bg-blue-900
"

>

<Video size={20}/>

<input

type="file"

accept="video/*"

className="hidden"

/>

</label>



<input

className="
flex-1
min-w-0

rounded-2xl

px-4
py-3

bg-slate-100
dark:bg-slate-900

text-slate-900
dark:text-white

outline-none

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

w-12
h-12

rounded-2xl

flex
items-center
justify-center

bg-gradient-to-r
from-blue-600
to-blue-800

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

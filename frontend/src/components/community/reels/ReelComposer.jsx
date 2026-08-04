import { useEffect, useRef, useState } from "react";
import {
  Camera,
  SwitchCamera,
  Upload,
  Music,
  Sparkles,
  Smile,
  Sticker,
  Type,
  Palette,
  Scissors,
  Move,
  PenTool,
  AtSign,
  Layers,
  X,
  Check,
} from "lucide-react";

const TOOLS = [
  { icon: Music, label: "music" },
  { icon: Sparkles, label: "effects" },
  { icon: Smile, label: "emoji" },
  { icon: Sticker, label: "stickers" },
  { icon: Type, label: "text" },
  { icon: Palette, label: "filters" },
  { icon: Scissors, label: "trim" },
  { icon: Move, label: "move" },
  { icon: PenTool, label: "draw" },
  { icon: AtSign, label: "mention" },
];

export default function ReelComposer({
  onClose,
  onPublish,
}) {

  const videoRef = useRef(null);

  const [stream,setStream]=useState(null);

  const [cameraMode,setCameraMode]=useState("front");

  const [layout,setLayout]=useState("fullscreen");

  const [videoFile,setVideoFile]=useState(null);

  const [videoUrl,setVideoUrl]=useState("");

  const mediaRecorderRef=useRef(null);

  const recordedChunksRef=useRef([]);

  const [recording,setRecording]=useState(false);


  const [activeTool,setActiveTool]=useState(null);

  const [dragItem,setDragItem]=useState(null);

  const [editor,setEditor]=useState({
    music:null,
    effects:[],
    texts:[],
    emojis:[],
    stickers:[],
    filters:[],
    drawings:[],
    trim:null,
    mentions:[]
  });


useEffect(() => {
  if (videoRef.current && stream) {
    videoRef.current.srcObject = stream;
  }

  return () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };
}, [stream]);

async function openCamera(mode){

  try{

    if(stream){
      stream.getTracks().forEach(track=>track.stop());
    }

    const media=await navigator.mediaDevices.getUserMedia({

      video:{
        facingMode:
          mode==="back"
            ?"environment"
            :"user"
      },

      audio:true

    });

    setStream(media);
    setCameraMode(mode);
    setVideoFile(null);
    setVideoUrl("");

  }catch(err){

    console.error(err);

    alert("Camera access failed");

  }

}

async function openDualCamera(){

  setLayout("split");

  await openCamera("front");

}

function stopCamera(){

  if(stream){
    stream.getTracks().forEach(track=>track.stop());
  }

  setStream(null);

}

function uploadVideo(e){

  const file=e.target.files?.[0];

  if(!file) return;

  stopCamera();

  setVideoFile(file);

  setVideoUrl(URL.createObjectURL(file));

}


function startRecording(){

  if(!stream) return;

  recordedChunksRef.current=[];

  const recorder=new MediaRecorder(stream,{
    mimeType:"video/webm"
  });

  mediaRecorderRef.current=recorder;

  recorder.ondataavailable=(e)=>{
    if(e.data && e.data.size>0){
      recordedChunksRef.current.push(e.data);
    }
  };

  recorder.onstop=()=>{

    const blob=new Blob(recordedChunksRef.current,{
      type:"video/webm"
    });

    const file=new File(
      [blob],
      `reel-${Date.now()}.webm`,
      {type:"video/webm"}
    );

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(blob));
    stopCamera();
    setRecording(false);
  };

  recorder.start();
  setRecording(true);

}

function stopRecording(){

  if(
    mediaRecorderRef.current &&
    mediaRecorderRef.current.state==="recording"
  ){
    mediaRecorderRef.current.stop();
  }

}


function updateEditor(field,value){

  setEditor(prev=>({

    ...prev,

    [field]:value

  }));

}

function moveItem(type,index,x,y){

  setEditor(prev=>({

    ...prev,

    [type]:prev[type].map((item,i)=>

      i===index
        ?{
            ...item,
            x,
            y
          }
        :item

    )

  }));

}

function handleTouchStart(type,index){

  setDragItem({type,index});

}

function handleTouchMove(e){

  if(!dragItem) return;

  const t=e.touches[0];

  moveItem(

    dragItem.type,

    dragItem.index,

    t.clientX,

    t.clientY

  );

}

function handleTouchEnd(){

  setDragItem(null);

}

function publish(){

  if(!videoFile){
    alert("Please record or select a video first.");
    return;
  }

  console.log("VIDEO FILE:", videoFile);
  console.log("PUBLISH PAYLOAD:", {
    file: videoFile,
    editor,
    cameraMode,
    layout,
  });

  console.log("========== REEL DEBUG ==========");
  console.log("VIDEO FILE:", videoFile);
  console.log("VIDEO URL:", videoUrl);
  console.log("EDITOR:", editor);
  console.log("CAMERA:", cameraMode);
  console.log("LAYOUT:", layout);
onPublish?.({

    type:"reel",

    file:videoFile,

    editor,

    cameraMode,

    layout

  });

}


return (

<div className="fixed inset-0 z-50 bg-black text-white flex flex-col">

<header className="flex items-center justify-between border-b border-slate-800 p-4">


{stream && (
  <button
    onClick={recording ? stopRecording : startRecording}
    className="rounded-xl bg-red-600 px-4 py-2 font-semibold"
  >
    {recording ? "Stop Recording" : "Start Recording"}
  </button>
)}

<button onClick={onClose}>

<X/>
</button>

<h2 className="font-semibold">
Create Reel
</h2>

<button onClick={publish}>
<Check/>
</button>

</header>

<main className="relative flex-1 overflow-hidden">

{(stream || videoUrl) && (

<div className="absolute inset-0">

{stream && (

<video
ref={videoRef}
autoPlay
muted
playsInline
className="h-full w-full object-cover"
/>

)}

{!stream && videoUrl && (

<video
src={videoUrl}
autoPlay
loop
controls
className="h-full w-full object-cover"
/>

)}

</div>

)}

<div
className="absolute inset-0 z-10 pointer-events-none"
>

{editor.texts.map((t,i)=>(

<div
key={i}
draggable
className="absolute text-2xl font-bold text-white cursor-move"
style={{
left:t.x,
top:t.y
}}
onTouchStart={()=>handleTouchStart("texts",i)}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
onDragEnd={(e)=>moveItem("texts",i,e.clientX,e.clientY)}
>

{t.value}

</div>

))}

{editor.emojis.map((e,i)=>(

<div
key={i}
draggable
className="absolute text-5xl cursor-move"
style={{
left:e.x,
top:e.y
}}
onTouchStart={()=>handleTouchStart("emojis",i)}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
onDragEnd={(ev)=>moveItem("emojis",i,ev.clientX,ev.clientY)}
>

{e.value}

</div>

))}

{editor.stickers.map((s,i)=>(

<div
key={i}
draggable
className="absolute text-5xl cursor-move"
style={{
left:s.x,
top:s.y
}}
onTouchStart={()=>handleTouchStart("stickers",i)}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
onDragEnd={(ev)=>moveItem("stickers",i,ev.clientX,ev.clientY)}
>

{s.value}

</div>

))}

</div>


<div className="absolute left-4 top-4 z-20 flex flex-col gap-3">

<button
onClick={()=>openCamera("front")}
className="rounded-full bg-black/70 p-3"
title="Front Camera"
>
<Camera size={20}/>
</button>

<button
onClick={()=>
openCamera(
cameraMode==="front"
?"back"
:"front"
)}
className="rounded-full bg-black/70 p-3"
title="Switch Camera"
>
<SwitchCamera size={20}/>
</button>

<button
onClick={openDualCamera}
className="rounded-full bg-black/70 p-3"
title="Dual Camera"
>
<Layers size={20}/>
</button>

<button
onClick={()=>setLayout("pip")}
className="rounded-full bg-black/70 p-3"
title="Picture in Picture"
>
<Layers size={20}/>
</button>

<button
onClick={stopCamera}
className="rounded-full bg-red-600 p-3"
title="Stop Camera"
>
<X size={20}/>
</button>

<label className="cursor-pointer rounded-full bg-black/70 p-3">

<Upload size={20}/>

<input
hidden
type="file"
accept="video/*"
onChange={uploadVideo}
/>

</label>

</div>

<div className="absolute right-4 top-4 z-20 flex flex-col gap-3">

{TOOLS.map(({icon:Icon,label})=>(

<button
key={label}
onClick={()=>setActiveTool(label)}
className="rounded-full bg-black/70 p-3"
title={label}
>

<Icon size={20}/>

</button>

))}

</div>

<div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">

<textarea
rows={2}
placeholder="Write a caption..."
className="w-full rounded-lg bg-black/40 p-3 outline-none"
/>

<div className="mt-3 flex justify-between text-sm text-slate-300">

<span>
Camera: {cameraMode}
</span>

<span>
Layout: {layout}
</span>

</div>

</div>

{activeTool && (

<div className="absolute bottom-0 left-0 right-0 z-30 rounded-t-3xl border-t border-slate-700 bg-slate-900 p-5">

<div className="mb-4 flex items-center justify-between">

<h3 className="capitalize font-semibold">
{activeTool}
</h3>

<button onClick={()=>setActiveTool(null)}>
<X size={18}/>
</button>

</div>

<p className="text-sm text-slate-300">
{activeTool} tools
</p>

</div>

)}

</main>

</div>

);

}

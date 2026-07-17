import { useState } from "react";

export default function NewFolderDialog({ open,onClose }){

const[name,setName]=useState("");

if(!open)return null;

return(

<div className="fixed inset-0 flex items-center justify-center bg-black/60">

<div className="w-96 rounded-2xl bg-slate-900 p-6">

<h2 className="mb-4 text-xl font-bold text-white">

New Folder

</h2>

<input

value={name}

onChange={(e)=>setName(e.target.value)}

className="w-full rounded-xl bg-slate-800 p-3 text-white"

/>

<div className="mt-6 flex justify-end gap-3">

<button
onClick={onClose}
className="rounded-xl bg-slate-700 px-5 py-2 text-white">

Cancel

</button>

<button
className="rounded-xl bg-sky-600 px-5 py-2 text-white">

Create

</button>

</div>

</div>

</div>

);

}

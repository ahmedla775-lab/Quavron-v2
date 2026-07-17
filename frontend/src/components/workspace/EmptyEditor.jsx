import { FileCode2 } from "lucide-react";

export default function EmptyEditor(){

return(

<div className="flex h-full flex-col items-center justify-center text-slate-500">

<FileCode2 className="mb-6 h-16 w-16"/>

<h2 className="text-2xl">

Open a file to start editing

</h2>

</div>

);

}

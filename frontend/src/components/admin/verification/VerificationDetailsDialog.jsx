import { useState } from "react";

import VerificationBadge from "../../profile/VerificationBadge";
import AdminVerificationService from "../../../services/admin/AdminVerificationService";

const TYPES = [
  {
    value: "blue",
    label: "🔵 Blue",
  },
  {
    value: "gray",
    label: "⚪ Gray",
  },
  {
    value: "gold",
    label: "🟡 Gold",
  },
  {
    value: "star",
    label: "⭐ Star",
  },
];

export default function VerificationDetailsDialog({
  request,
  open,
  onClose,
  onUpdated,
}) {

  const [loading,setLoading]=useState(false);

  const [type,setType]=useState("blue");

  if(!open || !request) return null;

  const profile=request.profiles||{};

  async function approve(){

    setLoading(true);

    const {error}=await AdminVerificationService.approve(
      request.id,
      profile.id,
      type
    );

    setLoading(false);

    if(error){

      alert(error.message);

      return;

    }

    onUpdated();

    onClose();

  }

  async function reject(){

    setLoading(true);

    const {error}=await AdminVerificationService.reject(
      request.id
    );

    setLoading(false);

    if(error){

      alert(error.message);

      return;

    }

    onUpdated();

    onClose();

  }

  return(

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

<div className="w-full max-w-2xl rounded-3xl bg-slate-900 p-8">

<h2 className="mb-8 text-3xl font-bold text-white">

Verification Request

</h2>

<div className="flex items-center gap-5">

<img
src={
profile.avatar_url ||
"https://ui-avatars.com/api/?name=Q"
}
alt=""
className="h-24 w-24 rounded-full object-cover"
/>

<div>

<div className="flex items-center gap-2">

<h3 className="text-2xl font-bold text-white">

{profile.full_name}

</h3>

<VerificationBadge

verified={profile.verified}

type={profile.verification_type}

size={22}

/>

</div>

<p className="text-slate-400">

@{profile.username}

</p>

</div>

</div>

<div className="mt-8 space-y-5">

<div>

<p className="mb-2 text-slate-400">

Account Type

</p>

<div className="rounded-xl bg-slate-800 p-3 text-white">

{request.account_type || "-"}

</div>

</div>

<div>

<p className="mb-2 text-slate-400">

Website

</p>

<div className="rounded-xl bg-slate-800 p-3 text-white">

{request.website || "-"}

</div>

</div>

<div>

<p className="mb-2 text-slate-400">

Reason

</p>

<div className="min-h-[120px] rounded-xl bg-slate-800 p-4 text-white whitespace-pre-wrap">

{request.reason || "-"}

</div>

</div>

{request.document_url && (

<div>

<p className="mb-2 text-slate-400">

Document

</p>

<a

href={request.document_url}

target="_blank"

rel="noreferrer"

className="text-blue-400 hover:underline"

>

Open Document

</a>

</div>

)}

<div>

<p className="mb-2 text-slate-400">

Verification Badge

</p>

<select

value={type}

onChange={(e)=>setType(e.target.value)}

className="w-full rounded-xl bg-slate-800 p-3 text-white"

>

{TYPES.map((item)=>(

<option

key={item.value}

value={item.value}

>

{item.label}

</option>

))}

</select>

</div>

</div>

<div className="mt-10 flex justify-end gap-3">

<button

onClick={onClose}

className="rounded-xl bg-slate-700 px-6 py-3 text-white"

>

Close

</button>

<button

disabled={loading}

onClick={reject}

className="rounded-xl bg-red-600 px-6 py-3 text-white"

>

Reject

</button>

<button

disabled={loading}

onClick={approve}

className="rounded-xl bg-emerald-600 px-6 py-3 text-white"

>

Approve

</button>

</div>

</div>

</div>

);

}

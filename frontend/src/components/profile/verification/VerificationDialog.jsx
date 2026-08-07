import { useEffect, useState } from "react";
import VerificationRequestService from "../../../services/VerificationRequestService";

export default function VerificationDialog({
  profile,
  open,
  onClose,
}) {

  const [request,setRequest] = useState(null);
  const [loading,setLoading] = useState(false);

  const [verificationType,setVerificationType] = useState("blue");


  async function loadRequest(){

    if(!profile) return;

    const {data} =
      await VerificationRequestService.getMyRequest(
        profile.id
      );

    setRequest(data);
  }


  useEffect(()=>{

    if(open && profile){
      loadRequest();
    }

  },[open,profile]);


  async function submitRequest(){

    setLoading(true);


    const businessTypes = [
      "seller",
      "company_owner",
      "startup",
      "organization"
    ];


    const isBusiness =
      businessTypes.includes(
        profile.account_type
      );


    const {error} =
      await VerificationRequestService.create({

        user_id: profile.id,

        status:"pending",

        account_type:
          profile.account_type || "individual",

        verification_kind:
          verificationType,

      });


    setLoading(false);


    if(error){
      alert(error.message);
      return;
    }


    await loadRequest();

  }


  if(!open) return null;


  return (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

<div className="w-full max-w-lg rounded-3xl border bg-[var(--q-surface)] p-8">


<h2 className="text-3xl font-bold text-[var(--q-text)]">
Account Verification
</h2>


<p className="mt-2 text-[var(--q-muted)]">
Request official Quavron verification.
</p>


{!request && !profile?.verified && (

<div className="mt-8 space-y-5">


<label className="block text-[var(--q-text)]">
Verification Type
</label>


<select

value={verificationType}

onChange={(e)=>
setVerificationType(e.target.value)
}

className="w-full rounded-xl border p-3 bg-[var(--q-surface)]"

>


<option value="blue">
Blue Badge - Individual
</option>


<option value="black">
Black Badge - Company
</option>


<option value="white">
White Badge - Government
</option>


<option value="gray">
Gray Badge - Contributor
</option>


</select>



<button

disabled={loading}

onClick={submitRequest}

className="w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"

>

{loading
?
"Submitting..."
:
"Request Verification"}

</button>


</div>

)}


{request && (

<div className="mt-8 rounded-xl border p-5">

<p className="font-bold text-yellow-400">
Status: {request.status}
</p>

</div>

)}



<button

onClick={onClose}

className="mt-8 rounded-xl bg-[var(--q-card)] px-6 py-3"

>

Close

</button>


</div>

</div>

  );

}

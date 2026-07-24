export default function VerificationCard({

request,

profile,

onRequest,

}){

let title="Not Verified";
let color="text-slate-400";
let button=true;

if(profile.verified){

title="Verified";
color="text-sky-400";
button=false;

}else if(request){

switch(request.status){

case "pending":
title="Pending Review";
color="text-yellow-400";
button=false;
break;

case "approved":
title="Approved";
color="text-sky-400";
button=false;
break;

case "rejected":
title="Rejected";
color="text-red-400";
button=true;
break;

default:
break;

}

}

return(

<div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

<h2 className="text-xl font-bold text-white">

Verification

</h2>

<p className={`mt-3 font-semibold ${color}`}>

{title}

</p>

{button && (

<button

onClick={onRequest}

className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-white"

>

Request Verification

</button>

)}

</div>

);

}

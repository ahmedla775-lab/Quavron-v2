import {
CheckCircle,
BadgeCheck,
ShieldCheck,
Star,
} from "lucide-react";

export default function VerificationBadge({

type="none",

size=18,

}){

if(type==="none") return null;

if(type==="blue"){

return(
<BadgeCheck
size={size}
className="inline text-sky-500 fill-sky-500"
/>
);

}

if(type==="gray"){

return(
<ShieldCheck
size={size}
className="inline text-slate-400 fill-slate-400"
/>
);

}

if(type==="gold"){

return(
<BadgeCheck
size={size}
className="inline text-yellow-500 fill-yellow-500"
/>
);

}

if(type==="star"){

return(
<Star
size={size}
className="inline text-amber-400 fill-amber-400"
/>
);

}

return null;

}

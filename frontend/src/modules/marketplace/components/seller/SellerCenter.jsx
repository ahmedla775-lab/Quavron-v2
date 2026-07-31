import {
  Store,
  Building2,
  Package,
  ShoppingBag,
  Truck,
  BarChart3,
  DollarSign,
  ShieldCheck,
  Star,
} from "lucide-react";

const sections = [

{
title:"Company Profile",
icon:Building2,
description:"Register your company and verification.",
},

{
title:"Products",
icon:Package,
description:"Manage your products and inventory.",
},

{
title:"Orders",
icon:ShoppingBag,
description:"Track customer orders.",
},

{
title:"Delivery",
icon:Truck,
description:"Manage shipping companies.",
},

{
title:"Sales",
icon:DollarSign,
description:"Revenue and financial reports.",
},

{
title:"Analytics",
icon:BarChart3,
description:"Marketplace statistics.",
},

{
title:"Reviews",
icon:Star,
description:"Customer ratings.",
},

{
title:"Verification",
icon:ShieldCheck,
description:"Official Seller Verification.",
},

];

export default function SellerCenter(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Seller Center
</h2>

<p style={{color:"var(--q-muted)"}}>
Everything needed to manage your business.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

{sections.map((item)=>{

const Icon=item.icon;

return(

<div
key={item.title}
className="rounded-3xl border p-6 transition hover:scale-[1.03]"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white">

<Icon size={30}/>

</div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{item.title}
</h3>

<p
className="mt-3"
style={{color:"var(--q-muted)"}}
>
{item.description}
</p>

</div>

);

})}

</div>

<div
className="rounded-3xl border p-8"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="flex items-center gap-4">

<div
className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 text-white"
>

<Store size={40}/>

</div>

<div>

<h3
className="text-2xl font-black"
style={{color:"var(--q-text)"}}
>
Open Your Marketplace Store
</h3>

<p style={{color:"var(--q-muted)"}}>
Start selling products and services through Quavron Marketplace.
</p>

</div>

</div>

<button
className="mt-8 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"
>
Create Seller Account
</button>

</div>

</section>

);

}

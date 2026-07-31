import {
  Package,
  ShoppingCart,
  Truck,
  Users,
  DollarSign,
  Star,
  MessageCircle,
  BarChart3,
  BadgePercent,
  Megaphone,
  Building2,
  UserCog,
} from "lucide-react";

const cards = [

{
title:"Products",
value:"248",
icon:Package,
},

{
title:"Orders",
value:"1,583",
icon:ShoppingCart,
},

{
title:"Customers",
value:"12,490",
icon:Users,
},

{
title:"Revenue",
value:"18.2M DZD",
icon:DollarSign,
},

{
title:"Delivery Partners",
value:"12",
icon:Truck,
},

{
title:"Reviews",
value:"4.9 / 5",
icon:Star,
},

{
title:"Messages",
value:"48",
icon:MessageCircle,
},

{
title:"Analytics",
value:"Live",
icon:BarChart3,
},

{
title:"Offers",
value:"15",
icon:BadgePercent,
},

{
title:"Advertisements",
value:"3 Active",
icon:Megaphone,
},

{
title:"Branches",
value:"7",
icon:Building2,
},

{
title:"Employees",
value:"26",
icon:UserCog,
},

];

export default function StoreDashboard(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Store Dashboard
</h2>

<p style={{color:"var(--q-muted)"}}>
Manage your entire marketplace business from one place.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

{cards.map((card)=>{

const Icon=card.icon;

return(

<div

key={card.title}

className="rounded-3xl border p-6 transition hover:scale-[1.03]"

style={{

background:"var(--q-surface)",

borderColor:"var(--q-border)"

}}

>

<div className="flex items-center justify-between">

<div>

<h3
className="font-bold"
style={{color:"var(--q-text)"}}
>
{card.title}
</h3>

<p
className="mt-3 text-3xl font-black text-cyan-500"
>
{card.value}
</p>

</div>

<div
className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white"
>

<Icon size={30}/>

</div>

</div>

</div>

);

})}

</div>

</section>

);

}

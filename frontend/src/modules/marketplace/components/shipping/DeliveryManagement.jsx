import {
  Truck,
  MapPin,
  Clock3,
  Star,
  CheckCircle2,
} from "lucide-react";

const companies = [
  {
    id:1,
    name:"Quavron Logistics",
    coverage:"Nationwide",
    time:"24-48 Hours",
    price:"From $4",
    rating:"4.9",
    verified:true,
  },
  {
    id:2,
    name:"Express Delivery",
    coverage:"Major Cities",
    time:"Same Day",
    price:"From $7",
    rating:"4.8",
    verified:true,
  },
  {
    id:3,
    name:"Fast Cargo",
    coverage:"International",
    time:"3-7 Days",
    price:"From $15",
    rating:"4.7",
    verified:false,
  },
];

export default function DeliveryManagement(){

  return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Delivery Companies
</h2>

<p style={{color:"var(--q-muted)"}}>
Choose the logistics partner for every order.
</p>

</div>

<div className="space-y-5">

{companies.map(company=>(

<div
key={company.id}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

<div className="flex gap-5">

<div
className="rounded-2xl p-4"
style={{
background:"#06b6d4",
color:"#fff",
}}
>

<Truck size={30}/>

</div>

<div>

<h3
className="text-2xl font-bold"
style={{color:"var(--q-text)"}}
>
{company.name}
</h3>

<div className="mt-3 flex flex-wrap gap-5">

<span className="flex items-center gap-2">
<MapPin size={16}/>
{company.coverage}
</span>

<span className="flex items-center gap-2">
<Clock3 size={16}/>
{company.time}
</span>

<span className="flex items-center gap-2">
<Star size={16}/>
{company.rating}
</span>

</div>

</div>

</div>

<div className="text-right">

<div
className="text-3xl font-black"
style={{
color:"#06b6d4",
}}
>
{company.price}
</div>

{company.verified && (

<div className="mt-2 flex items-center justify-end gap-2 text-green-500">

<CheckCircle2 size={18}/>

Verified

</div>

)}

<button
className="mt-4 rounded-2xl px-6 py-3 font-bold"
style={{
background:"#06b6d4",
color:"#fff",
}}
>

Select Company

</button>

</div>

</div>

</div>

))}

</div>

</section>

);

}

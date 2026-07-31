import {
  Truck,
  Clock3,
  MapPinned,
  ShieldCheck,
  Star,
  Package,
} from "lucide-react";

const companies = [
  {
    id: 1,
    name: "Quavron Delivery",
    country: "Algeria",
    state: "Djelfa",
    city: "Djelfa",
    delivery: "24 Hours",
    price: "350 DZD",
    rating: 4.9,
    verified: true,
  },
  {
    id: 2,
    name: "Express DZ",
    country: "Algeria",
    state: "Algiers",
    city: "Bab Ezzouar",
    delivery: "48 Hours",
    price: "500 DZD",
    rating: 4.7,
    verified: true,
  },
];

export default function LogisticsHub() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Logistics Hub
</h2>

<p style={{color:"var(--q-muted)"}}>
Choose the delivery company that best fits your order.
</p>

</div>

<div className="grid gap-6">

{companies.map(company=>(

<div
key={company.id}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

<div className="space-y-4">

<div className="flex items-center gap-3">

<Truck size={28}/>

<h3
className="text-2xl font-black"
style={{color:"var(--q-text)"}}
>
{company.name}
</h3>

{company.verified && (
<ShieldCheck color="#06b6d4"/>
)}

</div>

<div className="grid gap-3 md:grid-cols-2">

<div className="flex items-center gap-2">
<MapPinned size={18}/>
{company.country} • {company.state} • {company.city}
</div>

<div className="flex items-center gap-2">
<Clock3 size={18}/>
{company.delivery}
</div>

<div className="flex items-center gap-2">
<Package size={18}/>
Shipping: {company.price}
</div>

<div className="flex items-center gap-2">
<Star size={18}/>
{company.rating}
</div>

</div>

</div>

<div className="flex items-center">

<button
className="rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-white"
>
Choose Company
</button>

</div>

</div>

</div>

))}

</div>

</section>

  );

}

import {
  Truck,
  Clock3,
  Star,
  MapPinned,
} from "lucide-react";

const companies = [
  {
    id: 1,
    name: "Quavron Express",
    country: "Algeria",
    states: "58 Wilayas",
    cities: "All Major Cities",
    days: "24-48 Hours",
    price: "600 DZD",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Yalidine",
    country: "Algeria",
    states: "58 Wilayas",
    cities: "National Coverage",
    days: "1-3 Days",
    price: "450 DZD",
    rating: 4.8,
  },
  {
    id: 3,
    name: "EMS International",
    country: "Worldwide",
    states: "International",
    cities: "220+ Countries",
    days: "3-7 Days",
    price: "Calculated",
    rating: 4.7,
  },
];

export default function ShippingCompanies() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Shipping Companies
</h2>

<p style={{color:"var(--q-muted)"}}>
Choose your preferred delivery company.
</p>

</div>

<div className="grid gap-6 lg:grid-cols-3">

{companies.map((company)=>(

<div
key={company.id}
className="rounded-3xl border p-6 transition hover:scale-[1.02]"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div
className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white"
>
<Truck size={30}/>
</div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{company.name}
</h3>

<div className="mt-5 space-y-3">

<div className="flex items-center gap-2">
<MapPinned size={16}/>
<span>{company.country}</span>
</div>

<div className="flex items-center gap-2">
<MapPinned size={16}/>
<span>{company.states}</span>
</div>

<div className="flex items-center gap-2">
<MapPinned size={16}/>
<span>{company.cities}</span>
</div>

<div className="flex items-center gap-2">
<Clock3 size={16}/>
<span>{company.days}</span>
</div>

<div className="flex items-center gap-2">
<Star size={16} className="text-yellow-500"/>
<span>{company.rating}</span>
</div>

</div>

<div className="mt-6 flex items-center justify-between">

<strong
className="text-cyan-500"
>
{company.price}
</strong>

<button
className="rounded-xl bg-cyan-500 px-5 py-2 font-bold text-white"
>
Select
</button>

</div>

</div>

))}

</div>

</section>

  );

}

import {
  Building2,
  Factory,
  Truck,
  Store,
  User,
  Search,
  MapPinned,
} from "lucide-react";

const sections = [
  {
    title: "Industrial Companies",
    icon: Factory,
    count: 312,
  },
  {
    title: "Delivery Companies",
    icon: Truck,
    count: 54,
  },
  {
    title: "Service Institutions",
    icon: Building2,
    count: 648,
  },
  {
    title: "Commercial Institutions",
    icon: Store,
    count: 905,
  },
  {
    title: "Private Sellers",
    icon: User,
    count: 4810,
  },
];

export default function BusinessDirectory() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Business Directory
</h2>

<p style={{color:"var(--q-muted)"}}>
Companies, institutions and sellers organized by location.
</p>

</div>

<div className="grid gap-5 lg:grid-cols-4">

<input
placeholder="Search..."
className="rounded-2xl border p-3"
/>

<select className="rounded-2xl border p-3">
<option>Country</option>
<option>Algeria</option>
<option>France</option>
<option>UAE</option>
<option>Saudi Arabia</option>
</select>

<select className="rounded-2xl border p-3">
<option>State / Province</option>
</select>

<select className="rounded-2xl border p-3">
<option>City</option>
</select>

</div>

<div className="space-y-5">

{sections.map(section=>{

const Icon=section.icon;

return(

<div
key={section.title}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex items-center justify-between">

<div className="flex items-center gap-5">

<div
className="rounded-2xl p-4"
style={{
background:"#06b6d4",
color:"#fff",
}}
>

<Icon size={28}/>

</div>

<div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{section.title}
</h3>

<p style={{color:"var(--q-muted)"}}>
{section.count} Registered
</p>

</div>

</div>

<button
className="rounded-2xl px-5 py-3 font-bold"
style={{
background:"#06b6d4",
color:"#fff",
}}
>

Explore

</button>

</div>

</div>

);

})}

</div>

<div
className="rounded-3xl border p-8"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex items-center gap-4">

<MapPinned
size={36}
color="#06b6d4"
/>

<div>

<h3
className="text-2xl font-bold"
style={{color:"var(--q-text)"}}
>
Location Based Marketplace
</h3>

<p style={{color:"var(--q-muted)"}}>
Search companies using Country → State → City.
</p>

</div>

</div>

</div>

</section>

);

}

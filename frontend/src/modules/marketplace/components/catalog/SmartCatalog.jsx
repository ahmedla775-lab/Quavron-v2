import {
  Search,
  Filter,
  Globe2,
  MapPinned,
  Building2,
  Package,
  Star,
  Heart,
} from "lucide-react";

const stats = [
  { label: "Products", value: "284,950" },
  { label: "Companies", value: "8,412" },
  { label: "Countries", value: "195" },
  { label: "Categories", value: "420" },
];

export default function SmartCatalog() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Smart Product Catalog
</h2>

<p style={{color:"var(--q-muted)"}}>
  Global intelligent catalog for products and services.
</p>
</div>

<div className="grid gap-4 lg:grid-cols-6">

<input
placeholder="Search products..."
className="rounded-2xl border p-3 lg:col-span-2"
/>

<select className="rounded-2xl border p-3">
<option>Country</option>
</select>

<select className="rounded-2xl border p-3">
<option>State</option>
</select>

<select className="rounded-2xl border p-3">
<option>City</option>
</select>

<button
className="rounded-2xl bg-cyan-500 text-white font-bold"
>
<Search className="inline mr-2" size={18}/>
Search
</button>

</div>

<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

{stats.map(item=>(

<div
key={item.label}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div
className="text-4xl font-black"
style={{color:"#06b6d4"}}
>
{item.value}
</div>

<p
className="mt-2"
style={{color:"var(--q-muted)"}}
>
{item.label}
</p>

</div>

))}

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

{[
["Country",Globe2],
["Location",MapPinned],
["Companies",Building2],
["Products",Package],
["Ratings",Star],
["Favorites",Heart],
["Filters",Filter],
["Smart Search",Search],
].map(([title,Icon])=>{

const I=Icon;

return(

<div
key={title}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<I
size={30}
color="#06b6d4"
/>

<h3
className="mt-4 text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{title}
</h3>

</div>

);

})}

</div>

</section>

);

}

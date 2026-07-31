import {
  Plus,
  Palette,
  Ruler,
  HardDrive,
  Boxes,
} from "lucide-react";

const variants = [

{
id:1,
color:"Black",
size:"128 GB",
sku:"QV-001-BLK-128",
price:"245000 DZD",
stock:12,
},

{
id:2,
color:"Silver",
size:"256 GB",
sku:"QV-001-SLV-256",
price:"275000 DZD",
stock:8,
},

];

export default function ProductVariants(){

return(

<section className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Product Variants
</h2>

<p style={{color:"var(--q-muted)"}}>
Manage colors, sizes and storage options.
</p>

</div>

<button
className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-white"
>

<Plus size={20}/>

Add Variant

</button>

</div>

<div
className="overflow-hidden rounded-3xl border"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<table className="w-full">

<thead>

<tr
style={{
background:"rgba(6,182,212,.08)"
}}
>

<th className="p-4 text-left">Color</th>

<th>Storage / Size</th>

<th>SKU</th>

<th>Price</th>

<th>Stock</th>

</tr>

</thead>

<tbody>

{variants.map(item=>(

<tr
key={item.id}
className="border-t"
style={{
borderColor:"var(--q-border)"
}}
>

<td className="p-4">

<div className="flex items-center gap-2">

<Palette size={18}/>

{item.color}

</div>

</td>

<td>

<div className="flex items-center gap-2">

<HardDrive size={18}/>

{item.size}

</div>

</td>

<td>{item.sku}</td>

<td>{item.price}</td>

<td>

<div className="flex items-center gap-2">

<Boxes size={18}/>

{item.stock}

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

<div
className="rounded-3xl border p-8"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<h3
className="mb-6 text-xl font-bold"
style={{color:"var(--q-text)"}}
>
Create Variant
</h3>

<div className="grid gap-5 md:grid-cols-2">

<input
placeholder="Color"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Size / Storage"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="SKU"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Price"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Stock Quantity"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Weight"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Length"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Width"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Height"
className="rounded-2xl border p-4 bg-transparent"
/>

</div>

<button
className="mt-8 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"
>

Save Variant

</button>

</div>

</section>

);

}

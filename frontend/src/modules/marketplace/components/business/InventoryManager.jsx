import {
  Boxes,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const inventory = [

{
id:1,
product:"Quavron AI Workstation",
stock:42,
minimum:10,
status:"In Stock",
},

{
id:2,
product:"Mechanical Keyboard",
stock:8,
minimum:15,
status:"Low Stock",
},

{
id:3,
product:"Cloud Server Package",
stock:"Unlimited",
minimum:"-",
status:"Digital",
},

];

export default function InventoryManager(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Inventory Management
</h2>

<p style={{color:"var(--q-muted)"}}>
Monitor your inventory across all products.
</p>

</div>

<div className="grid gap-6 md:grid-cols-4">

<div className="rounded-3xl border p-6" style={{background:"var(--q-surface)",borderColor:"var(--q-border)"}}>
<Boxes className="mb-4 text-cyan-500"/>
<h3 className="font-bold">Products</h3>
<p className="mt-3 text-3xl font-black text-cyan-500">248</p>
</div>

<div className="rounded-3xl border p-6" style={{background:"var(--q-surface)",borderColor:"var(--q-border)"}}>
<TrendingUp className="mb-4 text-green-500"/>
<h3 className="font-bold">Available</h3>
<p className="mt-3 text-3xl font-black text-green-500">231</p>
</div>

<div className="rounded-3xl border p-6" style={{background:"var(--q-surface)",borderColor:"var(--q-border)"}}>
<AlertTriangle className="mb-4 text-yellow-500"/>
<h3 className="font-bold">Low Stock</h3>
<p className="mt-3 text-3xl font-black text-yellow-500">14</p>
</div>

<div className="rounded-3xl border p-6" style={{background:"var(--q-surface)",borderColor:"var(--q-border)"}}>
<TrendingDown className="mb-4 text-red-500"/>
<h3 className="font-bold">Out of Stock</h3>
<p className="mt-3 text-3xl font-black text-red-500">3</p>
</div>

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

<tr style={{background:"rgba(6,182,212,.08)"}}>

<th className="p-4 text-left">Product</th>

<th>Stock</th>

<th>Minimum</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{inventory.map(item=>(

<tr
key={item.id}
className="border-t"
style={{borderColor:"var(--q-border)"}}
>

<td className="p-4 font-bold">

{item.product}

</td>

<td>{item.stock}</td>

<td>{item.minimum}</td>

<td>

<span
className="rounded-full px-3 py-1 text-sm text-white"
style={{
background:
item.status==="In Stock"
?"#16a34a"
:item.status==="Low Stock"
?"#f59e0b"
:"#2563eb"
}}
>

{item.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</div>

</section>

);

}

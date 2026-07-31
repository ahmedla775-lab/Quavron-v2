import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

const products = [

{
id:1,
name:"Quavron AI Workstation",
category:"Computers",
price:"245,000 DZD",
stock:42,
status:"Active",
},

{
id:2,
name:"Mechanical Keyboard",
category:"Accessories",
price:"18,500 DZD",
stock:120,
status:"Active",
},

{
id:3,
name:"Cloud Server Package",
category:"Cloud",
price:"12,000 DZD",
stock:"Unlimited",
status:"Active",
},

];

export default function ProductManager(){

return(

<section className="space-y-8">

<div className="flex items-center justify-between">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Products
</h2>

<p style={{color:"var(--q-muted)"}}>
Manage all your marketplace products.
</p>

</div>

<button
className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-bold text-white"
>

<Plus size={20}/>

New Product

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

<th className="p-4 text-left">Product</th>
<th>Category</th>
<th>Price</th>
<th>Stock</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{products.map(product=>(

<tr
key={product.id}
className="border-t"
style={{
borderColor:"var(--q-border)"
}}
>

<td className="p-4 font-bold">
{product.name}
</td>

<td>{product.category}</td>

<td>{product.price}</td>

<td>{product.stock}</td>

<td>

<span className="rounded-full bg-green-500 px-3 py-1 text-sm text-white">

{product.status}

</span>

</td>

<td>

<div className="flex gap-3">

<button>

<Eye size={18}/>

</button>

<button>

<Pencil size={18}/>

</button>

<button className="text-red-500">

<Trash2 size={18}/>

</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</section>

);

}

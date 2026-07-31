import {
  Building2,
  User,
  Truck,
  Store,
  Wrench,
  Factory,
} from "lucide-react";

const businessTypes = [

{
id:1,
title:"Company",
icon:Building2,
},

{
id:2,
title:"Industrial Company",
icon:Factory,
},

{
id:3,
title:"Commercial Store",
icon:Store,
},

{
id:4,
title:"Service Provider",
icon:Wrench,
},

{
id:5,
title:"Delivery Company",
icon:Truck,
},

{
id:6,
title:"Private Seller",
icon:User,
},

];

export default function BusinessRegistration(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Business Registration
</h2>

<p style={{color:"var(--q-muted)"}}>
Register your business on Quavron Marketplace.
</p>

</div>

<div
className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
>

{businessTypes.map((item)=>{

const Icon=item.icon;

return(

<div

key={item.id}

className="cursor-pointer rounded-3xl border p-6 transition hover:border-cyan-500 hover:shadow-lg"

style={{

background:"var(--q-surface)",

borderColor:"var(--q-border)"

}}

>

<div
className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white"
>

<Icon size={30}/>

</div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>

{item.title}

</h3>

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

<div className="grid gap-6 md:grid-cols-2">

<input
placeholder="Business Name"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Owner Name"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Business Email"
className="rounded-2xl border p-4 bg-transparent"
/>

<input
placeholder="Phone Number"
className="rounded-2xl border p-4 bg-transparent"
/>

<select className="rounded-2xl border p-4 bg-transparent">

<option>Country</option>

<option>Algeria</option>

<option>Tunisia</option>

<option>Morocco</option>

<option>France</option>

<option>Saudi Arabia</option>

<option>United Arab Emirates</option>

</select>

<select className="rounded-2xl border p-4 bg-transparent">

<option>State / Province</option>

</select>

<select className="rounded-2xl border p-4 bg-transparent">

<option>City</option>

</select>

<input
placeholder="Website"
className="rounded-2xl border p-4 bg-transparent"
/>

</div>

<textarea

rows={5}

placeholder="Business Description"

className="mt-6 w-full rounded-2xl border p-4 bg-transparent"

/>

<div className="mt-6 grid gap-4 md:grid-cols-2">

<input
type="file"
className="rounded-2xl border p-4"
/>

<input
type="file"
className="rounded-2xl border p-4"
/>

</div>

<button

className="mt-8 rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"

>

Continue

</button>

</div>

</section>

);

}

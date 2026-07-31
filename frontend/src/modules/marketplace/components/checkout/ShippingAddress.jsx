import { MapPin } from "lucide-react";

export default function ShippingAddress() {

return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Shipping Address
</h2>

<p style={{color:"var(--q-muted)"}}>
Choose your delivery location.
</p>

</div>

<div
className="rounded-3xl border p-8"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="mb-8 flex items-center gap-3">

<MapPin className="text-cyan-500"/>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
Delivery Information
</h3>

</div>

<div className="grid gap-6 md:grid-cols-2">

<input
placeholder="Full Name"
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
placeholder="Postal Code"
className="rounded-2xl border p-4 bg-transparent"
/>

</div>

<textarea
rows={5}
placeholder="Full Delivery Address"
className="mt-6 w-full rounded-2xl border p-4 bg-transparent"
/>

</div>

</section>

);

}

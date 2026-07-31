import {
  Heart,
  ShoppingCart,
  Star,
  Package,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

export default function ProductShowcase() {

return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Featured Product
</h2>

<p style={{color:"var(--q-muted)"}}>
Professional product presentation.
</p>

</div>

<div
className="grid gap-8 rounded-3xl border p-8 lg:grid-cols-2"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div>

<div
className="aspect-square rounded-3xl"
style={{
background:"linear-gradient(135deg,#0ea5e9,#0891b2)"
}}
>

</div>

<div className="mt-4 grid grid-cols-4 gap-3">

{[1,2,3,4].map((i)=>(

<div
key={i}
className="aspect-square rounded-2xl border"
style={{
background:"var(--q-card)",
borderColor:"var(--q-border)"
}}
/>

))}

</div>

</div>

<div>

<div className="flex items-center gap-2">

<BadgeCheck color="#06b6d4"/>

<p>Verified Seller</p>

</div>

<h1
className="mt-3 text-4xl font-black"
style={{color:"var(--q-text)"}}
>
Quavron AI Workstation
</h1>

<div className="mt-4 flex items-center gap-4">

<div className="flex items-center gap-1">

<Star fill="#facc15" color="#facc15"/>

<Star fill="#facc15" color="#facc15"/>

<Star fill="#facc15" color="#facc15"/>

<Star fill="#facc15" color="#facc15"/>

<Star fill="#facc15" color="#facc15"/>

</div>

<span>4.9 (245 Reviews)</span>

</div>

<p
className="mt-6 text-4xl font-black text-cyan-500"
>
245,000 DZD
</p>

<div className="mt-8 space-y-4">

<div className="flex items-center gap-3">

<Package/>

<span>Available in stock</span>

</div>

<div className="flex items-center gap-3">

<Truck/>

<span>Delivery Available</span>

</div>

<div className="flex items-center gap-3">

<ShieldCheck/>

<span>Official Warranty</span>

</div>

<div className="flex items-center gap-3">

<RotateCcw/>

<span>Easy Returns</span>

</div>

</div>

<div className="mt-8 flex flex-wrap gap-4">

<button
className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"
>

<ShoppingCart
className="mr-2 inline"
size={20}
/>

Buy Now

</button>

<button
className="rounded-2xl border px-8 py-4"
>

<Heart
className="mr-2 inline"
size={20}
/>

Wishlist

</button>

</div>

</div>

</div>

</section>

);

}

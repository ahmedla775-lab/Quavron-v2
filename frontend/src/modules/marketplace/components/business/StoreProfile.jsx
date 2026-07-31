import {
  MapPin,
  Phone,
  Globe,
  Clock3,
  Star,
  Heart,
  MessageCircle,
  BadgeCheck,
  Users,
} from "lucide-react";

export default function StoreProfile() {

return (

<section className="space-y-8">

<div
className="overflow-hidden rounded-3xl border"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div
className="h-56"
style={{
background:"linear-gradient(135deg,#0891b2,#0ea5e9,#22d3ee)"
}}
/>

<div className="p-8">

<div className="-mt-24 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

<div className="flex gap-6">

<div
className="h-40 w-40 rounded-3xl border-4 border-white bg-white"
/>

<div>

<div className="flex items-center gap-3">

<h2
className="text-4xl font-black"
style={{color:"var(--q-text)"}}
>
Quavron Official Store
</h2>

<BadgeCheck
size={28}
className="text-cyan-500"
/>

</div>

<p
className="mt-2"
style={{color:"var(--q-muted)"}}
>
Official Technology Marketplace
</p>

<div className="mt-5 flex flex-wrap gap-6">

<div className="flex items-center gap-2">

<Star className="text-yellow-500"/>

<span>4.9</span>

</div>

<div className="flex items-center gap-2">

<Users/>

<span>18,250 Followers</span>

</div>

<div className="flex items-center gap-2">

<MapPin/>

<span>Algeria • Djelfa</span>

</div>

</div>

</div>

</div>

<div className="flex gap-4">

<button
className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-white"
>
Follow
</button>

<button
className="rounded-2xl border px-6 py-4"
>

<MessageCircle/>

</button>

<button
className="rounded-2xl border px-6 py-4"
>

<Heart/>

</button>

</div>

</div>

<hr className="my-8"/>

<div className="grid gap-8 lg:grid-cols-2">

<div>

<h3
className="mb-4 text-2xl font-bold"
style={{color:"var(--q-text)"}}
>
Store Information
</h3>

<div className="space-y-4">

<div className="flex items-center gap-3">

<Phone/>

+213 XXX XX XX XX

</div>

<div className="flex items-center gap-3">

<Globe/>

www.quavron.com

</div>

<div className="flex items-center gap-3">

<Clock3/>

08:00 - 18:00

</div>

<div className="flex items-center gap-3">

<MapPin/>

Djelfa • Algeria

</div>

</div>

</div>

<div>

<h3
className="mb-4 text-2xl font-bold"
style={{color:"var(--q-text)"}}
>
About Store
</h3>

<p style={{color:"var(--q-muted)"}}>

Quavron Official Store offers professional software,
AI solutions, hardware,
cloud services,
developer tools,
training,
and marketplace products.

</p>

</div>

</div>

</div>

</div>

</section>

);

}

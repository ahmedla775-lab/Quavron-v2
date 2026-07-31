import {
  Building2,
  Factory,
  Store,
  User,
  BadgeCheck,
  MapPinned,
  Phone,
  Globe,
  Mail,
  Clock3,
  Star,
  Users,
  Package,
  MessageCircle,
} from "lucide-react";

const businesses = [
  {
    name: "Quavron Industries",
    type: "Industrial Company",
    country: "Algeria",
    state: "Djelfa",
    city: "Djelfa",
    verified: true,
    rating: 4.9,
    products: 182,
  },
  {
    name: "Express Delivery",
    type: "Delivery Company",
    country: "Algeria",
    state: "Algiers",
    city: "Bab Ezzouar",
    verified: true,
    rating: 4.8,
    products: 42,
  },
];

export default function BusinessProfiles() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Business Profiles
</h2>

<p style={{color:"var(--q-muted)"}}>
Verified companies, institutions and sellers.
</p>

</div>

<div className="space-y-6">

{businesses.map((business)=>(
<div
key={business.name}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

<div className="flex gap-5">

<div
className="flex h-20 w-20 items-center justify-center rounded-3xl"
style={{
background:"#06b6d4",
color:"#fff",
}}
>
<Building2 size={40}/>
</div>

<div>

<div className="flex items-center gap-2">

<h3
className="text-2xl font-black"
style={{color:"var(--q-text)"}}
>
{business.name}
</h3>

{business.verified && (
<BadgeCheck color="#06b6d4"/>
)}

</div>

<p style={{color:"var(--q-muted)"}}>
{business.type}
</p>

<div className="mt-4 flex flex-wrap gap-5">

<div className="flex items-center gap-2">
<MapPinned size={18}/>
{business.country} • {business.state} • {business.city}
</div>

<div className="flex items-center gap-2">
<Star size={18}/>
{business.rating}
</div>

<div className="flex items-center gap-2">
<Package size={18}/>
{business.products} Products
</div>

</div>

</div>

</div>

<div className="grid gap-3">

<button
className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-white"
>
Visit Store
</button>

<button className="rounded-2xl border px-5 py-3">
<MessageCircle className="mr-2 inline" size={18}/>
Contact
</button>

</div>

</div>

<hr className="my-6"/>

<div className="grid gap-5 md:grid-cols-4">

<div className="flex items-center gap-3">
<Phone size={18}/>
Phone
</div>

<div className="flex items-center gap-3">
<Mail size={18}/>
Email
</div>

<div className="flex items-center gap-3">
<Globe size={18}/>
Website
</div>

<div className="flex items-center gap-3">
<Clock3 size={18}/>
Working Hours
</div>

</div>

</div>

))}

</div>

</section>

);

}

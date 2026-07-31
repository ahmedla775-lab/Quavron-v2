import {
  Store,
  Package,
  Boxes,
  DollarSign,
  TrendingUp,
  Star,
  MessageSquare,
  TicketPercent,
} from "lucide-react";

const modules = [
  {
    title: "Store Profile",
    icon: Store,
    description: "Manage company profile and public information.",
    color: "#2563eb",
  },
  {
    title: "Products",
    icon: Package,
    description: "Create and manage products.",
    color: "#06b6d4",
  },
  {
    title: "Inventory",
    icon: Boxes,
    description: "Inventory and stock management.",
    color: "#10b981",
  },
  {
    title: "Revenue",
    icon: DollarSign,
    description: "Sales and earnings dashboard.",
    color: "#f59e0b",
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    description: "Performance statistics.",
    color: "#8b5cf6",
  },
  {
    title: "Reviews",
    icon: Star,
    description: "Customer ratings and reviews.",
    color: "#ec4899",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    description: "Customer communication center.",
    color: "#14b8a6",
  },
  {
    title: "Coupons",
    icon: TicketPercent,
    description: "Discounts and promotional campaigns.",
    color: "#ef4444",
  },
];

export default function VendorCenter() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Vendor Center
</h2>

<p style={{color:"var(--q-muted)"}}>
Everything required to manage a professional business.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

{modules.map(module=>{

const Icon=module.icon;

return(

<div
key={module.title}
className="rounded-3xl border p-6 transition hover:scale-[1.02]"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div
className="mb-5 inline-flex rounded-2xl p-4"
style={{
background:module.color,
color:"#fff",
}}
>

<Icon size={28}/>

</div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{module.title}
</h3>

<p
className="mt-3"
style={{color:"var(--q-muted)"}}
>
{module.description}
</p>

<button
className="mt-6 w-full rounded-2xl py-3 font-bold"
style={{
background:module.color,
color:"#fff",
}}
>
Open
</button>

</div>

);

})}

</div>

</section>

);

}

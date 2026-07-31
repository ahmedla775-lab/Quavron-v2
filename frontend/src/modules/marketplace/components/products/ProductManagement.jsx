import {
  Package,
  Boxes,
  Tags,
  Images,
  Video,
  BadgeDollarSign,
  Star,
  Heart,
  Search,
} from "lucide-react";

const modules = [
  {
    title: "Products",
    icon: Package,
    description: "Create and edit unlimited products.",
    color: "#2563eb",
  },
  {
    title: "Inventory",
    icon: Boxes,
    description: "Stock management per product.",
    color: "#10b981",
  },
  {
    title: "Categories",
    icon: Tags,
    description: "Unlimited product categories.",
    color: "#06b6d4",
  },
  {
    title: "Media Gallery",
    icon: Images,
    description: "Multiple images for every product.",
    color: "#ec4899",
  },
  {
    title: "Product Videos",
    icon: Video,
    description: "Attach promotional videos.",
    color: "#ef4444",
  },
  {
    title: "Pricing",
    icon: BadgeDollarSign,
    description: "Prices, discounts and offers.",
    color: "#f59e0b",
  },
  {
    title: "Reviews",
    icon: Star,
    description: "Customer ratings and reviews.",
    color: "#8b5cf6",
  },
  {
    title: "Wishlist",
    icon: Heart,
    description: "Customer favorite products.",
    color: "#14b8a6",
  },
  {
    title: "Search & Filters",
    icon: Search,
    description: "Advanced search engine.",
    color: "#0ea5e9",
  },
];

export default function ProductManagement(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Product Management
</h2>

<p style={{color:"var(--q-muted)"}}>
Professional product management for companies and sellers.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

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

<Icon size={30}/>

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

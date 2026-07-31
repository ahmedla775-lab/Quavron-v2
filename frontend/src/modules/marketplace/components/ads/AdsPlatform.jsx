import {
  Megaphone,
  Building2,
  User,
  Target,
  BarChart3,
  Globe2,
} from "lucide-react";

const cards = [
  {
    title: "Quavron Official Ads",
    icon: Megaphone,
    description: "Official announcements and sponsored campaigns.",
    color: "#06b6d4",
  },
  {
    title: "Business Advertisements",
    icon: Building2,
    description: "Companies promote products and services.",
    color: "#2563eb",
  },
  {
    title: "User Advertisements",
    icon: User,
    description: "Individual sponsored listings.",
    color: "#10b981",
  },
  {
    title: "Audience Targeting",
    icon: Target,
    description: "Country • State • City • Interests",
    color: "#f59e0b",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    description: "Clicks • Reach • Conversions",
    color: "#8b5cf6",
  },
  {
    title: "Global Campaigns",
    icon: Globe2,
    description: "Worldwide advertising management.",
    color: "#ef4444",
  },
];

export default function AdsPlatform() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Quavron Ads Platform
</h2>

<p style={{color:"var(--q-muted)"}}>
Advertising ecosystem for companies, institutions and users.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

{cards.map(card=>{

const Icon=card.icon;

return(

<div
key={card.title}
className="rounded-3xl border p-6 transition hover:scale-[1.02]"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div
className="mb-5 inline-flex rounded-2xl p-4"
style={{
background:card.color,
color:"#fff",
}}
>

<Icon size={28}/>

</div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{card.title}
</h3>

<p
className="mt-3"
style={{color:"var(--q-muted)"}}
>
{card.description}
</p>

<button
className="mt-6 rounded-2xl px-5 py-3 font-bold"
style={{
background:card.color,
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

import {
  ShoppingCart,
  Truck,
  CreditCard,
  PackageCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const orders = [
  {
    id: "#QVR-1001",
    customer: "Ahmed Murad",
    company: "Quavron Logistics",
    total: "$2450",
    status: "Preparing",
  },
  {
    id: "#QVR-1002",
    customer: "John Smith",
    company: "Express Delivery",
    total: "$780",
    status: "Shipping",
  },
  {
    id: "#QVR-1003",
    customer: "Sara Ali",
    company: "Fast Cargo",
    total: "$120",
    status: "Delivered",
  },
];

export default function OrderManagement() {

  return (

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Order Management
</h2>

<p style={{color:"var(--q-muted)"}}>
Manage customer orders from purchase to delivery.
</p>

</div>

<div className="grid gap-5 lg:grid-cols-4">

<div className="rounded-3xl border p-5">
<ShoppingCart size={30}/>
<h3 className="mt-3 font-bold">Orders</h3>
<p>1,248</p>
</div>

<div className="rounded-3xl border p-5">
<CreditCard size={30}/>
<h3 className="mt-3 font-bold">Payments</h3>
<p>$284,000</p>
</div>

<div className="rounded-3xl border p-5">
<Truck size={30}/>
<h3 className="mt-3 font-bold">Shipping</h3>
<p>231 Active</p>
</div>

<div className="rounded-3xl border p-5">
<PackageCheck size={30}/>
<h3 className="mt-3 font-bold">Delivered</h3>
<p>987</p>
</div>

</div>

<div className="space-y-5">

{orders.map(order=>(

<div
key={order.id}
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

<div>

<h3
className="text-xl font-bold"
style={{color:"var(--q-text)"}}
>
{order.id}
</h3>

<p style={{color:"var(--q-muted)"}}>
Customer: {order.customer}
</p>

<p style={{color:"var(--q-muted)"}}>
Delivery: {order.company}
</p>

</div>

<div>

<div
className="text-2xl font-black"
style={{color:"#06b6d4"}}
>
{order.total}
</div>

<div className="mt-2 flex items-center gap-2">

<Clock3 size={16}/>

{order.status}

</div>

</div>

<div className="flex gap-3">

<button
className="rounded-2xl px-5 py-3 font-bold"
style={{
background:"#06b6d4",
color:"#fff",
}}
>
View
</button>

<button
className="rounded-2xl border px-5 py-3"
>
Invoice
</button>

<button
className="rounded-2xl border px-5 py-3"
>
Tracking
</button>

</div>

</div>

</div>

))}

</div>

<div
className="rounded-3xl border p-8"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)",
}}
>

<div className="flex items-center gap-4">

<CheckCircle2
size={34}
color="#10b981"
/>

<div>

<h3
className="text-2xl font-bold"
style={{color:"var(--q-text)"}}
>
Complete Order Lifecycle
</h3>

<p style={{color:"var(--q-muted)"}}>
Purchase → Payment → Shipping → Delivery → Review.
</p>

</div>

</div>

</div>

</section>

);

}

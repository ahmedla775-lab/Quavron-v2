import {
  CreditCard,
  Wallet,
  Landmark,
  Banknote,
  ShieldCheck,
} from "lucide-react";

const methods = [

{
id:1,
title:"Credit / Debit Card",
subtitle:"Visa • Mastercard • American Express",
icon:CreditCard,
},

{
id:2,
title:"Quavron Wallet",
subtitle:"Pay using your wallet balance",
icon:Wallet,
},

{
id:3,
title:"Bank Transfer",
subtitle:"Direct bank payment",
icon:Landmark,
},

{
id:4,
title:"Cash On Delivery",
subtitle:"Pay when your order arrives",
icon:Banknote,
},

];

export default function PaymentMethods(){

return(

<section className="space-y-8">

<div>

<h2
className="text-3xl font-black"
style={{color:"var(--q-text)"}}
>
Payment Method
</h2>

<p style={{color:"var(--q-muted)"}}>
Select how you want to pay.
</p>

</div>

<div className="grid gap-6 md:grid-cols-2">

{methods.map((method)=>{

const Icon=method.icon;

return(

<label
key={method.id}
className="cursor-pointer"
>

<input
type="radio"
name="payment"
className="hidden"
/>

<div
className="rounded-3xl border p-6 transition hover:border-cyan-500 hover:shadow-lg"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="flex items-center gap-4">

<div
className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-white"
>

<Icon size={26}/>

</div>

<div>

<h3
className="font-bold"
style={{color:"var(--q-text)"}}
>

{method.title}

</h3>

<p style={{color:"var(--q-muted)"}}>

{method.subtitle}

</p>

</div>

</div>

</div>

</label>

);

})}

</div>

<div
className="rounded-3xl border p-6"
style={{
background:"var(--q-surface)",
borderColor:"var(--q-border)"
}}
>

<div className="flex items-center gap-3">

<ShieldCheck className="text-cyan-500"/>

<div>

<h3
className="font-bold"
style={{color:"var(--q-text)"}}
>
Secure Checkout
</h3>

<p style={{color:"var(--q-muted)"}}>
All transactions are encrypted and protected.
</p>

</div>

</div>

<button
className="mt-8 w-full rounded-2xl bg-cyan-500 py-4 text-lg font-bold text-white"
>
Place Order
</button>

</div>

</section>

);

}

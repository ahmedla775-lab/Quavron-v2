import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";


export default function MarketplaceSettings(){

  const { user } = useAuth();


  const accountType =
    user?.user_metadata?.account_type ||
    "individual";


  const businessAccounts = [
    "seller",
    "company_owner",
    "startup",
    "organization",
    "quavron_official"
  ];


  const isBusiness =
    businessAccounts.includes(accountType);



  const [settings,setSettings] = useState({

    sellerMode:isBusiness,

    buyerMode:true,

    publicStore:false,

    allowMessages:true,

    showEmail:false,

    showPhone:false,

    autoAcceptOrders:false,

    allowOffers:true,

    allowReviews:true,

    showRatings:true,

    digitalProducts:true,

    physicalProducts:true,

    notifications:true,

    analytics:true,

    vacationMode:false

  });



  function toggle(key){

    setSettings(prev=>({

      ...prev,

      [key]:!prev[key]

    }));

  }



  return (

<div className="mx-auto max-w-5xl p-8">


<h1 className="text-3xl font-bold text-[var(--q-text)]">
Marketplace
</h1>


<p className="mt-2 text-[var(--q-muted)]">
Manage your marketplace identity and selling access.
</p>



<div className="mt-8 rounded-2xl border p-6 bg-[var(--q-surface)]">


<h2 className="text-xl font-bold text-[var(--q-text)]">
Account Type
</h2>


<p className="mt-2 text-[var(--q-muted)]">
{accountType}
</p>



</div>



{isBusiness ? (

<div className="mt-8 rounded-2xl border p-6">


<h2 className="text-xl font-bold">
Business Marketplace
</h2>


<p className="mt-2 text-[var(--q-muted)]">

Your account can create stores,
manage products and request business verification.

</p>


</div>

)

:

<div className="mt-8 rounded-2xl border p-6">

<h2 className="text-xl font-bold">

Personal Marketplace

</h2>


<p className="mt-2 text-[var(--q-muted)]">

You can buy products and upgrade your identity later.

</p>


</div>

}




<div className="mt-8 rounded-2xl border bg-[var(--q-surface)]">


{Object.entries(settings).map(([key,value])=>(

<div
key={key}
className="flex justify-between border-b p-5"
>


<span className="text-[var(--q-text)]">
{key}
</span>


<button

onClick={()=>toggle(key)}

className={
value
?
"rounded-full bg-green-600 px-5 py-2 text-white"
:
"rounded-full bg-slate-700 px-5 py-2 text-white"
}

>

{value ? "ON":"OFF"}

</button>


</div>


))}


</div>



<button

className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white"

>

Save Changes

</button>


</div>

  );

}

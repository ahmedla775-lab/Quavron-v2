import { useState } from "react";

export default function MarketplaceSettings() {

  const [settings, setSettings] = useState({

    sellerMode: true,

    buyerMode: true,

    publicStore: true,

    allowMessages: true,

    showEmail: false,

    showPhone: false,

    autoAcceptOrders: false,

    allowOffers: true,

    allowReviews: true,

    showRatings: true,

    digitalProducts: true,

    physicalProducts: true,

    notifications: true,

    analytics: true,

    vacationMode: false,

    featuredSeller: false,

  });

  function toggle(key){

    setSettings(prev=>({

      ...prev,

      [key]:!prev[key],

    }));

  }

  return(

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Marketplace

      </h1>

      <p className="mt-2 text-slate-400">

        Configure your Marketplace profile and selling preferences.

      </p>

      <div className="mt-10 space-y-8">

        <Section
          title="Account"
          items={[
            ["Enable Seller Account","sellerMode"],
            ["Enable Buyer Account","buyerMode"],
            ["Public Store","publicStore"],
            ["Marketplace Notifications","notifications"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Store"
          items={[
            ["Auto Accept Orders","autoAcceptOrders"],
            ["Allow Offers","allowOffers"],
            ["Allow Reviews","allowReviews"],
            ["Display Ratings","showRatings"],
            ["Vacation Mode","vacationMode"],
            ["Featured Seller","featuredSeller"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Products"
          items={[
            ["Digital Products","digitalProducts"],
            ["Physical Products","physicalProducts"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Privacy"
          items={[
            ["Allow Buyer Messages","allowMessages"],
            ["Show Email","showEmail"],
            ["Show Phone","showPhone"],
            ["Store Analytics","analytics"],
          ]}
          settings={settings}
          toggle={toggle}
        />

      </div>

      <div className="mt-10 flex justify-end">

        <button
          className="
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            hover:bg-blue-700
          "
        >

          Save Changes

        </button>

      </div>

    </div>

  );

}

function Section({

  title,

  items,

  settings,

  toggle,

}){

  return(

    <div className="rounded-2xl border border-slate-800 bg-slate-900">

      <div className="border-b border-slate-800 p-5">

        <h2 className="text-xl font-semibold text-white">

          {title}

        </h2>

      </div>

      {items.map(([label,key])=>(

        <div
          key={key}
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-800
            p-5
            last:border-0
          "
        >

          <span className="text-white">

            {label}

          </span>

          <button
            onClick={()=>toggle(key)}
            className={`rounded-full px-5 py-2 font-semibold ${
              settings[key]
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-white"
            }`}
          >

            {settings[key] ? "ON" : "OFF"}

          </button>

        </div>

      ))}

    </div>

  );

}

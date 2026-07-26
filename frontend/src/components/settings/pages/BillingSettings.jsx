import { useState } from "react";

export default function BillingSettings() {

  const [settings, setSettings] = useState({

    plan: "Free",

    autoRenew: true,

    invoices: true,

    emailReceipts: true,

    savePaymentMethod: true,

    currency: "USD",

    paymentMethod: "Visa",

  });

  function toggle(key){

    setSettings(prev=>({

      ...prev,

      [key]:!prev[key],

    }));

  }

  function update(key,value){

    setSettings(prev=>({

      ...prev,

      [key]:value,

    }));

  }

  return(

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Billing & Subscription

      </h1>

      <p className="mt-2 text-slate-400">

        Manage your subscription, invoices and payment methods.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Current Plan">

          <Select
            value={settings.plan}
            onChange={(v)=>update("plan",v)}
            options={[
              "Free",
              "Pro",
              "Business",
              "Enterprise",
            ]}
          />

        </Card>

        <Card title="Payment Method">

          <Select
            value={settings.paymentMethod}
            onChange={(v)=>update("paymentMethod",v)}
            options={[
              "Visa",
              "MasterCard",
              "PayPal",
              "Stripe",
            ]}
          />

        </Card>

        <Card title="Currency">

          <Select
            value={settings.currency}
            onChange={(v)=>update("currency",v)}
            options={[
              "USD",
              "EUR",
              "DZD",
            ]}
          />

        </Card>

        <Section
          title="Billing Options"
          items={[
            ["Automatic Renewal","autoRenew"],
            ["Receive Invoices","invoices"],
            ["Email Receipts","emailReceipts"],
            ["Save Payment Method","savePaymentMethod"],
          ]}
          settings={settings}
          toggle={toggle}
        />

      </div>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-xl font-semibold text-white">

          Payment History

        </h2>

        <p className="mt-3 text-slate-400">

          No payments have been made yet.

        </p>

      </div>

      <div className="mt-10 flex justify-end gap-4">

        <button className="rounded-xl bg-slate-700 px-6 py-3 text-white">

          Download Invoices

        </button>

        <button className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700">

          Save Changes

        </button>

      </div>

    </div>

  );

}

function Card({title,children}){

  return(

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h2 className="mb-4 text-lg font-semibold text-white">

        {title}

      </h2>

      {children}

    </div>

  );

}

function Select({value,onChange,options}){

  return(

    <select
      value={value}
      onChange={(e)=>onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
    >

      {options.map(item=>(

        <option
          key={item}
          value={item}
        >

          {item}

        </option>

      ))}

    </select>

  );

}

function Section({title,items,settings,toggle}){

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
          className="flex items-center justify-between border-b border-slate-800 p-5 last:border-0"
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

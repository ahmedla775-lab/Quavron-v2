import { useState } from "react";

export default function APISettings() {

  const [settings, setSettings] = useState({

    apiEnabled: true,

    oauthEnabled: true,

    webhooksEnabled: false,

    rateLimit: "Standard",

    logRequests: true,

    allowCors: true,

    sandbox: false,

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

        API Settings

      </h1>

      <p className="mt-2 text-slate-400">

        Manage your API keys, OAuth applications and Webhooks.

      </p>

      <div className="mt-10 space-y-8">

        <Section
          title="API Access"
          items={[
            ["Enable API","apiEnabled"],
            ["OAuth Authentication","oauthEnabled"],
            ["Enable Webhooks","webhooksEnabled"],
            ["Request Logs","logRequests"],
            ["Allow CORS","allowCors"],
            ["Sandbox Mode","sandbox"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Card title="Rate Limit">

          <Select
            value={settings.rateLimit}
            onChange={(v)=>update("rateLimit",v)}
            options={[
              "Basic",
              "Standard",
              "Professional",
              "Enterprise",
            ]}
          />

        </Card>

        <Card title="API Keys">

          <div className="space-y-4">

            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

              <p className="text-sm text-slate-400">

                Primary API Key

              </p>

              <code className="mt-2 block text-green-400">

                YOUR_API_KEY_HERE
              </code>

            </div>

            <div className="flex gap-3">

              <button
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Generate New Key
              </button>

              <button
                className="rounded-xl bg-slate-700 px-5 py-3 text-white hover:bg-slate-600"
              >
                Revoke Key
              </button>

            </div>

          </div>

        </Card>

        <Card title="OAuth Applications">

          <button
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create OAuth Application
          </button>

        </Card>

        <Card title="Webhooks">

          <button
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Webhook
          </button>

        </Card>

        <Card title="API Documentation">

          <button
            className="rounded-xl bg-slate-700 px-5 py-3 text-white hover:bg-slate-600"
          >
            Open Documentation
          </button>

        </Card>

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

function Card({title,children}){

  return(

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h2 className="mb-5 text-lg font-semibold text-white">

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
      className="
        w-full
        rounded-xl
        border
        border-slate-700
        bg-slate-800
        p-3
        text-white
      "
    >

      {options.map(option=>(

        <option
          key={option}
          value={option}
        >
          {option}
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

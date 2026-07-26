import { useState } from "react";

export default function DeveloperSettings() {

  const [settings, setSettings] = useState({

    developerMode: true,

    apiAccess: true,

    webhooks: false,

    oauth: true,

    sshKeys: true,

    gitIntegration: true,

    cliAccess: true,

    sdkAccess: true,

    sandbox: true,

    logs: true,

    debugMode: false,

    telemetry: false,

    betaFeatures: false,

    experimental: false,

    rateLimit: "Standard",

    environment: "Production",

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

        Developer

      </h1>

      <p className="mt-2 text-slate-400">

        Manage APIs, integrations and developer tools.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Environment">

          <Select
            value={settings.environment}
            onChange={(v)=>update("environment",v)}
            options={[
              "Production",
              "Development",
              "Sandbox",
            ]}
          />

        </Card>

        <Card title="API Rate Limit">

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

        <Section
          title="Developer Features"
          items={[
            ["Developer Mode","developerMode"],
            ["API Access","apiAccess"],
            ["Webhooks","webhooks"],
            ["OAuth","oauth"],
            ["SSH Keys","sshKeys"],
            ["Git Integration","gitIntegration"],
            ["CLI Access","cliAccess"],
            ["SDK Access","sdkAccess"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Advanced"
          items={[
            ["Sandbox Environment","sandbox"],
            ["Developer Logs","logs"],
            ["Debug Mode","debugMode"],
            ["Telemetry","telemetry"],
            ["Beta Features","betaFeatures"],
            ["Experimental Features","experimental"],
          ]}
          settings={settings}
          toggle={toggle}
        />

      </div>

      <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-xl font-semibold text-white">

          API Keys

        </h2>

        <p className="mt-2 text-slate-400">

          Create and manage API keys for Quavron services.

        </p>

        <div className="mt-5 flex gap-4">

          <button
            className="
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-semibold
              text-white
            "
          >

            Generate API Key

          </button>

          <button
            className="
              rounded-xl
              bg-slate-700
              px-6
              py-3
              text-white
            "
          >

            View Keys

          </button>

        </div>

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

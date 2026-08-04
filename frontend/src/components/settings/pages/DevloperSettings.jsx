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

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Developer

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

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

      <div className="mt-10 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-6">

        <h2 className="text-xl font-semibold text-[var(--q-text)]">

          API Keys

        </h2>

        <p className="mt-2 text-[var(--q-muted)]">

          Create and manage API keys for Quavron services.

        </p>

        <div className="mt-5 flex gap-2">

          <button
            className="
              rounded-xl
              bg-blue-600
              px-3 md:px-6
              py-3
              font-semibold
              text-[var(--q-text)]
            "
          >

            Generate API Key

          </button>

          <button
            className="
              rounded-xl
              bg-slate-700
              px-3 md:px-6
              py-3
              text-[var(--q-text)]
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
            text-[var(--q-text)]
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

    <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <h2 className="mb-4 text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">

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
        border-[var(--q-border)]
        bg-[var(--q-card)]
        p-3
        text-[var(--q-text)]
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

    <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)]">

      <div className="border-b border-[var(--q-border)] p-3 md:p-5">

        <h2 className="text-xl font-semibold text-[var(--q-text)]">

          {title}

        </h2>

      </div>

      {items.map(([label,key])=>(

        <div
          key={key}
          className="
            flex
            items-center
            justify-start md:justify-between
            border-b
            border-[var(--q-border)]
            p-3 md:p-5
            last:border-0
          "
        >

          <span className="text-[var(--q-text)]">

            {label}

          </span>

          <button
            onClick={()=>toggle(key)}
            className={`rounded-full px-5 py-2 font-semibold ${
              settings[key]
                ? "bg-green-600 text-[var(--q-text)]"
                : "bg-slate-700 text-[var(--q-text)]"
            }`}
          >

            {settings[key] ? "ON" : "OFF"}

          </button>

        </div>

      ))}

    </div>

  );

}

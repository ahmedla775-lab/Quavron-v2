import { useState } from "react";

export default function HostingSettings() {

  const [settings, setSettings] = useState({

    autoDeploy: true,

    productionBranch: "main",

    buildCommand: "npm run build",

    outputDirectory: "dist",

    nodeVersion: "22",

    customDomain: "",

    ssl: true,

    gzip: true,

    cache: true,

    analytics: true,

    logs: true,

    maintenance: false,

    cdn: true,

    backups: true,

    environment: "production",

  });

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  function update(key, value) {

    setSettings((prev) => ({

      ...prev,

      [key]: value,

    }));

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Hosting

      </h1>

      <p className="mt-2 text-slate-400">

        Configure deployment, domains and hosting behavior.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Production Branch">

          <Input
            value={settings.productionBranch}
            onChange={(v)=>update("productionBranch",v)}
          />

        </Card>

        <Card title="Build Command">

          <Input
            value={settings.buildCommand}
            onChange={(v)=>update("buildCommand",v)}
          />

        </Card>

        <Card title="Output Directory">

          <Input
            value={settings.outputDirectory}
            onChange={(v)=>update("outputDirectory",v)}
          />

        </Card>

        <Card title="Node.js Version">

          <Select
            value={settings.nodeVersion}
            onChange={(v)=>update("nodeVersion",v)}
            options={[
              "18",
              "20",
              "22",
            ]}
          />

        </Card>

        <Card title="Environment">

          <Select
            value={settings.environment}
            onChange={(v)=>update("environment",v)}
            options={[
              "development",
              "preview",
              "production",
            ]}
          />

        </Card>

        <Card title="Custom Domain">

          <Input
            value={settings.customDomain}
            onChange={(v)=>update("customDomain",v)}
            placeholder="example.com"
          />

        </Card>

        <Switch
          title="Automatic Deployments"
          value={settings.autoDeploy}
          onClick={()=>toggle("autoDeploy")}
        />

        <Switch
          title="SSL Certificate"
          value={settings.ssl}
          onClick={()=>toggle("ssl")}
        />

        <Switch
          title="CDN"
          value={settings.cdn}
          onClick={()=>toggle("cdn")}
        />

        <Switch
          title="Compression (Gzip)"
          value={settings.gzip}
          onClick={()=>toggle("gzip")}
        />

        <Switch
          title="Caching"
          value={settings.cache}
          onClick={()=>toggle("cache")}
        />

        <Switch
          title="Analytics"
          value={settings.analytics}
          onClick={()=>toggle("analytics")}
        />

        <Switch
          title="Deployment Logs"
          value={settings.logs}
          onClick={()=>toggle("logs")}
        />

        <Switch
          title="Automatic Backups"
          value={settings.backups}
          onClick={()=>toggle("backups")}
        />

        <Switch
          title="Maintenance Mode"
          value={settings.maintenance}
          onClick={()=>toggle("maintenance")}
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

function Card({ title, children }) {

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h2 className="mb-4 text-lg font-semibold text-white">

        {title}

      </h2>

      {children}

    </div>

  );

}

function Input({

  value,

  onChange,

  placeholder="",

}){

  return(

    <input
      value={value}
      placeholder={placeholder}
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
    />

  );

}

function Select({

  value,

  onChange,

  options,

}){

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

      {options.map((item)=>(

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

function Switch({

  title,

  value,

  onClick,

}){

  return(

    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <span className="font-medium text-white">

        {title}

      </span>

      <button
        onClick={onClick}
        className={`rounded-full px-5 py-2 font-semibold ${
          value
            ? "bg-green-600 text-white"
            : "bg-slate-700 text-white"
        }`}
      >

        {value ? "ON" : "OFF"}

      </button>

    </div>

  );

}

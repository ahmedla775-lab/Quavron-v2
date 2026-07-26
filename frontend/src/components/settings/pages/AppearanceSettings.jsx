import { useState } from "react";

export default function AppearanceSettings() {

  const [settings, setSettings] = useState({

    theme: "dark",

    accent: "blue",

    fontSize: "medium",

    density: "comfortable",

    sidebar: "expanded",

    animations: true,

    glass: true,

    transparency: true,

    rounded: true,

  });

  function update(key, value) {

    setSettings((prev) => ({

      ...prev,

      [key]: value,

    }));

  }

  function toggle(key) {

    setSettings((prev) => ({

      ...prev,

      [key]: !prev[key],

    }));

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-white">

        Appearance

      </h1>

      <p className="mt-2 text-slate-400">

        Customize the look and feel of Quavron.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Theme">

          <Select
            value={settings.theme}
            onChange={(v)=>update("theme",v)}
            options={[
              "light",
              "dark",
              "system",
            ]}
          />

        </Card>

        <Card title="Accent Color">

          <Select
            value={settings.accent}
            onChange={(v)=>update("accent",v)}
            options={[
              "blue",
              "purple",
              "green",
              "orange",
              "red",
              "pink",
            ]}
          />

        </Card>

        <Card title="Font Size">

          <Select
            value={settings.fontSize}
            onChange={(v)=>update("fontSize",v)}
            options={[
              "small",
              "medium",
              "large",
            ]}
          />

        </Card>

        <Card title="Interface Density">

          <Select
            value={settings.density}
            onChange={(v)=>update("density",v)}
            options={[
              "comfortable",
              "compact",
            ]}
          />

        </Card>

        <Card title="Sidebar">

          <Select
            value={settings.sidebar}
            onChange={(v)=>update("sidebar",v)}
            options={[
              "expanded",
              "collapsed",
            ]}
          />

        </Card>

        <Switch
          title="Animations"
          value={settings.animations}
          onClick={()=>toggle("animations")}
        />

        <Switch
          title="Glass Effect"
          value={settings.glass}
          onClick={()=>toggle("glass")}
        />

        <Switch
          title="Transparency"
          value={settings.transparency}
          onClick={()=>toggle("transparency")}
        />

        <Switch
          title="Rounded Corners"
          value={settings.rounded}
          onClick={()=>toggle("rounded")}
        />

      </div>

      <div className="mt-10 flex justify-between">

        <button
          className="
            rounded-xl
            bg-slate-700
            px-6
            py-3
            text-white
          "
        >

          Reset Defaults

        </button>

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

function Card({

  title,

  children,

}){

  return(

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h2 className="mb-4 text-lg font-semibold text-white">

        {title}

      </h2>

      {children}

    </div>

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

import { useTheme } from "../../../theme/ThemeProvider";
import { useSettings } from "../../../context/SettingsContext";

export default function AppearanceSettings() {

  const { theme, setTheme } = useTheme();

  const {
    settings,
    updateSection,
  } = useSettings();

  const appearance = settings.appearance || {
    theme: "dark",
    accent: "green",
    fontSize: "medium",
    density: "comfortable",
    sidebar: "expanded",
    animations: true,
    glass: true,
    transparency: true,
    rounded: true,
  };

  function update(key, value) {

    updateSection("appearance", {
      ...appearance,
      [key]: value,
    });

  }

  function toggle(key) {

    updateSection("appearance", {
      [key]: !appearance[key],
    });

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Appearance

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Customize the look and feel of Quavron.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Theme">

          <Select
            value={appearance.theme}
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
            value={appearance.accent}
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
            value={appearance.fontSize}
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
            value={appearance.density}
            onChange={(v)=>update("density",v)}
            options={[
              "comfortable",
              "compact",
            ]}
          />

        </Card>

        <Card title="Sidebar">

          <Select
            value={appearance.sidebar}
            onChange={(v)=>update("sidebar",v)}
            options={[
              "expanded",
              "collapsed",
            ]}
          />

        </Card>

        <Switch
          title="Animations"
          value={appearance.animations}
          onClick={()=>toggle("animations")}
        />

        <Switch
          title="Glass Effect"
          value={appearance.glass}
          onClick={()=>toggle("glass")}
        />

        <Switch
          title="Transparency"
          value={appearance.transparency}
          onClick={()=>toggle("transparency")}
        />

        <Switch
          title="Rounded Corners"
          value={appearance.rounded}
          onClick={()=>toggle("rounded")}
        />

      </div>

      <div className="mt-10 flex justify-start md:justify-between">

        <button
          onClick={() =>
            updateSection("appearance", {
              theme:"dark",
              accent:"green",
              fontSize:"medium",
              density:"comfortable",
              sidebar:"expanded",
              animations:true,
              glass:true,
              transparency:true,
              rounded:true,
            })
          }
          className="
            rounded-xl
            bg-slate-700
            px-3 md:px-6
            py-3
            text-white
          "
        >

          Reset Defaults

        </button>

        <button
          onClick={() =>
            updateSection("appearance", appearance)
          }
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

function Card({

  title,

  children,

}){

  return(

    <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <h2 className="mb-4 text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">

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
        border-[var(--q-border)]
        bg-[var(--q-card)]
        p-3
        text-[var(--q-text)]
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

    <div className="flex items-center justify-start md:justify-between rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <span className="font-medium text-[var(--q-text)]">

        {title}

      </span>

      <button
        onClick={onClick}
        className={`rounded-full px-5 py-2 font-semibold ${
          value
            ? "bg-green-600 text-[var(--q-text)]"
            : "bg-slate-700 text-[var(--q-text)]"
        }`}
      >

        {value ? "ON" : "OFF"}

      </button>

    </div>

  );

}

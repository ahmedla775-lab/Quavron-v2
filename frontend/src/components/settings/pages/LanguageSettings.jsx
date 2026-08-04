import { useState } from "react";
import LanguageSwitcher from "../../common/LanguageSwitcher";

export default function LanguageSettings() {

  const [settings, setSettings] = useState({

    timezone: "Africa/Algiers",

    dateFormat: "dd/mm/yyyy",

    timeFormat: "24",

    firstDay: "monday",

    numberFormat: "1,234.56",

    rtl: true,

  });

  function update(key, value) {

    setSettings((prev) => ({

      ...prev,

      [key]: value,

    }));

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Language & Region

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Choose your language, region and formatting preferences.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Application Language">

          <LanguageSwitcher />

        </Card>

        <Card title="Time Zone">

          <Select
            value={settings.timezone}
            onChange={(v)=>update("timezone",v)}
            options={[
              "Africa/Algiers",
              "Europe/London",
              "Europe/Paris",
              "America/New_York",
              "Asia/Riyadh",
              "Asia/Dubai",
            ]}
          />

        </Card>

        <Card title="Date Format">

          <Select
            value={settings.dateFormat}
            onChange={(v)=>update("dateFormat",v)}
            options={[
              "dd/mm/yyyy",
              "mm/dd/yyyy",
              "yyyy-mm-dd",
            ]}
          />

        </Card>

        <Card title="Time Format">

          <Select
            value={settings.timeFormat}
            onChange={(v)=>update("timeFormat",v)}
            options={[
              "12",
              "24",
            ]}
          />

        </Card>

        <Card title="First Day Of Week">

          <Select
            value={settings.firstDay}
            onChange={(v)=>update("firstDay",v)}
            options={[
              "monday",
              "saturday",
              "sunday",
            ]}
          />

        </Card>

        <Card title="Number Format">

          <Select
            value={settings.numberFormat}
            onChange={(v)=>update("numberFormat",v)}
            options={[
              "1,234.56",
              "1 234,56",
              "1.234,56",
            ]}
          />

        </Card>

        <Switch
          title="Right To Left (RTL)"
          value={settings.rtl}
          onClick={()=>update("rtl",!settings.rtl)}
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

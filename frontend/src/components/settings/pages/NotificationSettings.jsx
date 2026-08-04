import { useState } from "react";

export default function NotificationSettings() {

  const [settings, setSettings] = useState({

    push: true,

    email: true,

    desktop: true,

    sound: true,

    vibration: true,

    messages: true,

    comments: true,

    mentions: true,

    follows: true,

    likes: true,

    community: true,

    ai: true,

    ide: true,

    hosting: true,

    marketplace: true,

    analytics: false,

    security: true,

    updates: true,

    marketing: false,

    newsletter: false,

  });

  function toggle(key){

    setSettings((prev)=>({

      ...prev,

      [key]: !prev[key],

    }));

  }

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Notifications

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Choose which notifications you want to receive.

      </p>

      <div className="mt-10 space-y-10">

        <Section
          title="General"
          items={[
            ["Push Notifications","push"],
            ["Desktop Notifications","desktop"],
            ["Email Notifications","email"],
            ["Sound","sound"],
            ["Vibration","vibration"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Social"
          items={[
            ["Messages","messages"],
            ["Comments","comments"],
            ["Mentions","mentions"],
            ["Followers","follows"],
            ["Likes","likes"],
            ["Community","community"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="Quavron Services"
          items={[
            ["AI Assistant","ai"],
            ["Cloud IDE","ide"],
            ["Hosting","hosting"],
            ["Marketplace","marketplace"],
            ["Analytics","analytics"],
          ]}
          settings={settings}
          toggle={toggle}
        />

        <Section
          title="System"
          items={[
            ["Security Alerts","security"],
            ["Platform Updates","updates"],
            ["Marketing","marketing"],
            ["Newsletter","newsletter"],
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
            className={`
              rounded-full
              px-5
              py-2
              font-semibold
              ${
                settings[key]
                ? "bg-green-600 text-[var(--q-text)]"
                : "bg-slate-700 text-[var(--q-text)]"
              }
            `}
          >

            {settings[key] ? "ON" : "OFF"}

          </button>

        </div>

      ))}

    </div>

  );

}

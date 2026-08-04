import { useState } from "react";

export default function AISettings() {

  const [settings, setSettings] = useState({

    model: "GPT-5.5",

    memory: true,

    context: true,

    autocomplete: true,

    codeSuggestions: true,

    chatHistory: true,

    smartSearch: true,

    voiceInput: false,

    streaming: true,

    safeMode: true,

    creativity: "balanced",

    responseLength: "medium",

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

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        AI Assistant

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Configure Quavron AI according to your workflow.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="AI Model">

          <Select
            value={settings.model}
            onChange={(v)=>update("model",v)}
            options={[
              "GPT-5.5",
              "GPT-5.5 Mini",
              "Claude",
              "Gemini",
              "DeepSeek",
            ]}
          />

        </Card>

        <Card title="Creativity">

          <Select
            value={settings.creativity}
            onChange={(v)=>update("creativity",v)}
            options={[
              "precise",
              "balanced",
              "creative",
            ]}
          />

        </Card>

        <Card title="Response Length">

          <Select
            value={settings.responseLength}
            onChange={(v)=>update("responseLength",v)}
            options={[
              "short",
              "medium",
              "long",
            ]}
          />

        </Card>

        <Switch
          title="Conversation Memory"
          value={settings.memory}
          onClick={()=>toggle("memory")}
        />

        <Switch
          title="Use Project Context"
          value={settings.context}
          onClick={()=>toggle("context")}
        />

        <Switch
          title="Code Auto Completion"
          value={settings.autocomplete}
          onClick={()=>toggle("autocomplete")}
        />

        <Switch
          title="Code Suggestions"
          value={settings.codeSuggestions}
          onClick={()=>toggle("codeSuggestions")}
        />

        <Switch
          title="Smart Search"
          value={settings.smartSearch}
          onClick={()=>toggle("smartSearch")}
        />

        <Switch
          title="Streaming Responses"
          value={settings.streaming}
          onClick={()=>toggle("streaming")}
        />

        <Switch
          title="Chat History"
          value={settings.chatHistory}
          onClick={()=>toggle("chatHistory")}
        />

        <Switch
          title="Voice Input"
          value={settings.voiceInput}
          onClick={()=>toggle("voiceInput")}
        />

        <Switch
          title="Safe Mode"
          value={settings.safeMode}
          onClick={()=>toggle("safeMode")}
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

function Card({ title, children }) {

  return (

    <div className="rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <h2 className="mb-4 text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">

        {title}

      </h2>

      {children}

    </div>

  );

}

function Select({ value, onChange, options }) {

  return (

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

function Switch({ title, value, onClick }) {

  return (

    <div className="flex items-center justify-start md:justify-between rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-5">

      <span className="text-[var(--q-text)] font-medium">

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

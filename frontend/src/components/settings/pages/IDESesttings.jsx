import { useState } from "react";

export default function IDESettings() {

  const [settings, setSettings] = useState({

    editor: "CodeMirror",

    theme: "Dark",

    fontSize: 14,

    fontFamily: "JetBrains Mono",

    tabSize: 2,

    wordWrap: true,

    minimap: true,

    lineNumbers: true,

    autoSave: true,

    formatOnSave: true,

    formatOnPaste: true,

    bracketPairColorization: true,

    codeLens: true,

    stickyScroll: true,

    terminal: true,

    terminalCursorBlink: true,

    terminalBell: false,

    gitIntegration: true,

    explorer: true,

    breadcrumbs: true,

    autosuggest: true,

    inlineAI: true,

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

        Cloud IDE

      </h1>

      <p className="mt-2 text-slate-400">

        Configure your coding environment.

      </p>

      <div className="mt-10 space-y-8">

        <Card title="Editor">

          <Select
            value={settings.editor}
            onChange={(v)=>update("editor",v)}
            options={[
              "CodeMirror",
              "Monaco",
            ]}
          />

        </Card>

        <Card title="Theme">

          <Select
            value={settings.theme}
            onChange={(v)=>update("theme",v)}
            options={[
              "Dark",
              "Light",
              "VS Code Dark",
              "GitHub Dark",
              "Dracula",
              "One Dark",
            ]}
          />

        </Card>

        <Card title="Font Family">

          <Select
            value={settings.fontFamily}
            onChange={(v)=>update("fontFamily",v)}
            options={[
              "JetBrains Mono",
              "Fira Code",
              "Cascadia Code",
              "Consolas",
            ]}
          />

        </Card>

        <Card title="Font Size">

          <input
            type="range"
            min="10"
            max="24"
            value={settings.fontSize}
            onChange={(e)=>update("fontSize",e.target.value)}
            className="w-full"
          />

          <p className="mt-3 text-slate-300">

            {settings.fontSize}px

          </p>

        </Card>

        <Card title="Tab Size">

          <Select
            value={settings.tabSize}
            onChange={(v)=>update("tabSize",v)}
            options={[
              2,
              4,
              8,
            ]}
          />

        </Card>

        <Switch title="Word Wrap"
          value={settings.wordWrap}
          onClick={()=>toggle("wordWrap")}
        />

        <Switch title="Minimap"
          value={settings.minimap}
          onClick={()=>toggle("minimap")}
        />

        <Switch title="Line Numbers"
          value={settings.lineNumbers}
          onClick={()=>toggle("lineNumbers")}
        />

        <Switch title="Auto Save"
          value={settings.autoSave}
          onClick={()=>toggle("autoSave")}
        />

        <Switch title="Format On Save"
          value={settings.formatOnSave}
          onClick={()=>toggle("formatOnSave")}
        />

        <Switch title="Format On Paste"
          value={settings.formatOnPaste}
          onClick={()=>toggle("formatOnPaste")}
        />

        <Switch title="Bracket Pair Colorization"
          value={settings.bracketPairColorization}
          onClick={()=>toggle("bracketPairColorization")}
        />

        <Switch title="Code Lens"
          value={settings.codeLens}
          onClick={()=>toggle("codeLens")}
        />

        <Switch title="Sticky Scroll"
          value={settings.stickyScroll}
          onClick={()=>toggle("stickyScroll")}
        />

        <Switch title="Terminal"
          value={settings.terminal}
          onClick={()=>toggle("terminal")}
        />

        <Switch title="Terminal Cursor Blink"
          value={settings.terminalCursorBlink}
          onClick={()=>toggle("terminalCursorBlink")}
        />

        <Switch title="Terminal Bell"
          value={settings.terminalBell}
          onClick={()=>toggle("terminalBell")}
        />

        <Switch title="Git Integration"
          value={settings.gitIntegration}
          onClick={()=>toggle("gitIntegration")}
        />

        <Switch title="Explorer"
          value={settings.explorer}
          onClick={()=>toggle("explorer")}
        />

        <Switch title="Breadcrumbs"
          value={settings.breadcrumbs}
          onClick={()=>toggle("breadcrumbs")}
        />

        <Switch title="Auto Suggestions"
          value={settings.autosuggest}
          onClick={()=>toggle("autosuggest")}
        />

        <Switch title="Inline AI Assistant"
          value={settings.inlineAI}
          onClick={()=>toggle("inlineAI")}
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

function Switch({title,value,onClick}){

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

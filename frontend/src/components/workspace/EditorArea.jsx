import EditorTabs from "./EditorTabs";
import TerminalPanel from "./TerminalPanel";

export default function EditorArea() {

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <EditorTabs />

      <div className="flex-1 overflow-auto">

        <pre className="min-h-full p-8 font-mono text-sm leading-7 text-slate-300">{`import React from "react";

export default function App() {

  return (

    <div>

      <h1>

        Welcome to Quavron IDE

      </h1>

    </div>

  );

}
`}</pre>

      </div>

      <TerminalPanel />

      <div className="flex h-8 items-center justify-between border-t border-slate-800 bg-slate-900 px-4 text-xs text-slate-400">

        <span>UTF-8</span>

        <span>JavaScript React</span>

        <span>Ln 1, Col 1</span>

      </div>

    </div>

  );

}

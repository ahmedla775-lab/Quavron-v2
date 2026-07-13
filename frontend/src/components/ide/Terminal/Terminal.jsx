import TerminalToolbar from "./TerminalToolbar";

import TerminalTabs from "./TerminalTabs";

import TerminalOutput from "./TerminalOutput";

export default function Terminal() {

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <TerminalToolbar />

      <TerminalTabs />

      <div className="flex-1 overflow-hidden">

        <TerminalOutput />

      </div>

    </div>

  );

}


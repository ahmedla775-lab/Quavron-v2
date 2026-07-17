import EditorTabs from "./EditorTabs";
import Breadcrumbs from "./Breadcrumbs";
import TerminalPanel from "./TerminalPanel";
import StatusBar from "./StatusBar";

import { useWorkspace } from "../../context/WorkspaceContext";

export default function EditorArea() {

  const {

    tabs,

    activeTab,

  } = useWorkspace();

  const currentFile =
    tabs.find(
      (tab) => tab.id === activeTab
    );

  return (

    <div className="flex h-full flex-col bg-slate-950">

      <EditorTabs />

      <Breadcrumbs />

      <div className="flex-1 overflow-auto">

        <div className="border-b border-slate-800 bg-slate-900 px-6 py-3">

          <h2 className="font-semibold text-white">

            {currentFile?.name || "No File Open"}

          </h2>

        </div>

        <pre className="min-h-full p-8 font-mono text-sm leading-7 text-slate-300">

{`// ${currentFile?.name || "No File"}

export default function Example() {

  return (

    <div>

      Editing:
      ${currentFile?.name || "Nothing"}

    </div>

  );

}
`}

        </pre>

      </div>

      <TerminalPanel />

      <StatusBar />

    </div>

  );

}

import {
  FileCode2,
  X,
} from "lucide-react";

import {
  useWorkspace,
} from "../../context/WorkspaceContext";

export default function EditorTabs() {

  const {

    tabs,

    activeTab,

    closeTab,

    setActiveTab,

  } = useWorkspace();

  return (

    <div className="flex h-11 items-center overflow-x-auto border-b border-slate-800 bg-slate-900">

      {tabs.map((tab) => (

        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex min-w-fit cursor-pointer items-center gap-2 border-r border-slate-800 px-4 py-3 transition ${
            activeTab === tab.id
              ? "bg-slate-950 text-white"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >

          <FileCode2 className="h-4 w-4 text-sky-400" />

          <span className="text-sm">

            {tab.name}

          </span>

          <button
            onClick={(e) => {

              e.stopPropagation();

              closeTab(tab.id);

            }}
            className="rounded p-1 transition hover:bg-slate-700"
          >

            <X className="h-3 w-3" />

          </button>

        </div>

      ))}

    </div>

  );

}

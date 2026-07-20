import { useState } from "react";
import BackButton from "../common/BackButton";
import ActivityBar from "./ActivityBar";
import ExplorerPanel from "./ExplorerPanel";

export default function WorkspaceLayout({

  children,

}) {

  const [activePanel, setActivePanel] =
    useState("explorer");

  return (

    <div className="flex h-screen overflow-hidden bg-slate-950">

      <ActivityBar
        active={activePanel}
        onChange={setActivePanel}
      />

      <div className="w-72 border-r border-slate-800">

        {activePanel === "explorer" && (

          <ExplorerPanel />

        )}

        {activePanel === "search" && (

          <div className="p-6 text-slate-400">

            Search Panel

          </div>

        )}

        {activePanel === "git" && (

          <div className="p-6 text-slate-400">

            Source Control

          </div>

        )}

        {activePanel === "debug" && (

          <div className="p-6 text-slate-400">

            Debug

          </div>

        )}

        {activePanel === "extensions" && (

          <div className="p-6 text-slate-400">

            Extensions

          </div>

        )}

        {activePanel === "ai" && (

          <div className="p-6 text-slate-400">

            AI Assistant

          </div>

        )}

        {activePanel === "settings" && (

          <div className="p-6 text-slate-400">

            Workspace Settings

          </div>

        )}

      </div>

      <main className="flex-1 overflow-hidden">
<div className="border-b border-slate-800 bg-slate-950 p-3">

  <BackButton />

</div>
        {children}

      </main>

    </div>

  );

}

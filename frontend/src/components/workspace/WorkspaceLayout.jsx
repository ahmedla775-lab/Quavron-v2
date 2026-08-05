import { useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";

import ActivityBar from "./ActivityBar";
import ExplorerPanel from "./ExplorerPanel";
import TopBar from "./topbar/TopBar";
import EditorTabs from "./EditorTabs";
import TerminalPanel from "./TerminalPanel";
import StatusBar from "./StatusBar";

import useMobile from "../../hooks/useMobile";

export default function WorkspaceLayout({
  children,
}) {

  const mobile = useMobile();
  const { isDark } = useTheme();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className={isDark ? "flex h-screen overflow-hidden bg-slate-950 text-white" : "flex h-screen overflow-hidden bg-white text-slate-900"}>

      {!mobile && <ActivityBar />}

      {mobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {mobile && (
        <div
          className={`
            fixed
            left-0
            top-0
            z-50
            h-full
            w-[82%]
            max-w-[340px]
            bg-[#1e1e1e]
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          <div className="flex h-full">

            <ActivityBar />

            <div className="flex-1 overflow-hidden">

              <ExplorerPanel
                onClose={() => setSidebarOpen(false)}
              />

            </div>

          </div>
        </div>
      )}

      {!mobile && (
        <div className={isDark ? "w-80 border-r border-slate-800" : "w-80 border-r border-slate-200"}>
          <ExplorerPanel />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">

        <TopBar
          onMenu={() =>
            setSidebarOpen((v) => !v)
          }
        />

        <EditorTabs />

        <div className="min-w-0 flex-1 overflow-hidden">
  {children}
</div>
        {!mobile && <TerminalPanel />}

        <StatusBar />

      </div>

    </div>
  );

}

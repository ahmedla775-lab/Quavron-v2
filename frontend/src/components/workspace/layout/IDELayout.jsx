import { useState } from "react";

export default function IDELayout({
  sidebar,
  explorer,
  topbar,
  tabs,
  editor,
  terminal,
  statusbar,
}) {
  const [showExplorer, setShowExplorer] = useState(false);
  const mobile = window.innerWidth < 768;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white">

      {!mobile && sidebar}

      <div className="flex flex-1 overflow-hidden">

        {mobile ? (
          <>
            {showExplorer && (
              <div className="absolute right-0 top-0 z-50 h-full w-72 border-l border-slate-800 bg-[#1e1e1e] shadow-2xl">
                {explorer}
              </div>
            )}

            <button
              onClick={() => setShowExplorer(!showExplorer)}
              className="absolute right-3 top-3 z-50 rounded bg-slate-800 px-3 py-2 text-sm"
            >
              ☰
            </button>
          </>
        ) : (
          explorer
        )}

        <div className="flex flex-1 flex-col overflow-hidden">

          {topbar}

          {tabs}

          <div className="flex-1 overflow-hidden">
            {editor}
          </div>

          {!mobile && terminal}

          {statusbar}

        </div>

      </div>

    </div>
  );
}

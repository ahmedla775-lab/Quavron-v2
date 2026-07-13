import { X } from "lucide-react";
import { useTabs } from "../../context/TabContext";

export default function EditorTabs() {

  const {
    tabs,
    activeTab,
    closeTab,
    setActiveTab,
  } = useTabs();

  if (tabs.length === 0) {
    return (
      <div className="flex h-12 items-center border-b border-slate-800 bg-slate-900 px-4 text-slate-500">
        No file opened
      </div>
    );
  }

  return (
    <div className="flex items-center overflow-x-auto border-b border-slate-800 bg-slate-900">

      {tabs.map((tab) => (

        <button
          key={tab.id}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center gap-2 px-4 py-3 transition ${
            activeTab?.id === tab.id
              ? "bg-slate-950 text-white"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >

          <span>{tab.name}</span>

          <X
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="cursor-pointer"
          />

        </button>

      ))}

    </div>
  );
}


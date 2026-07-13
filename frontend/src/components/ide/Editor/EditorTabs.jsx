import { X } from "lucide-react";
import { useTabs } from "../../../context/TabContext";

export default function EditorTabs() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    closeTab,
  } = useTabs();

  if (tabs.length === 0) {
    return (
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-500">
        No files open
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab)}
          className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap ${
            activeTab?.id === tab.id
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <span>{tab.name}</span>

          <X
            size={15}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          />
        </button>
      ))}
    </div>
  );
}

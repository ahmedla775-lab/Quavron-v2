import useWorkspace from "../../modules/workspace/hooks/useWorkspace";

export default function EditorTabs() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    closeTab,
  } = useWorkspace();

  if (!tabs.length) {
    return (
      <div className="flex h-10 items-center border-b border-slate-800 bg-slate-900 px-4 text-sm text-slate-500">
        No file opened
      </div>
    );
  }

  return (
    <div className="flex h-10 overflow-x-auto border-b border-slate-800 bg-slate-900">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex cursor-pointer items-center gap-2 px-4 text-sm ${
            activeTab === tab.id
              ? "bg-[#1e1e1e] text-white"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          <span>{tab.name}</span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="text-slate-500 hover:text-white"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

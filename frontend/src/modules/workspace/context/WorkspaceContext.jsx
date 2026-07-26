import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import WorkspaceActions from "../core/WorkspaceActions";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [tree, setTree] = useState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [tabs, setTabs] = useState([]);

  const [activeTab, setActiveTab] = useState(null);

  const actions = useMemo(
    () => new WorkspaceActions([]),
    []
  );

  useEffect(() => {
    const saved = actions.loadLocal();

    if (saved) {
      actions.setTree(saved);
      setTree([...saved]);
    }
  }, []);

  function refresh() {
    const next = [...actions.getTree()];

    actions.setTree(next);

    setTree(next);

    actions.saveLocal();
  }

  function openFile(fileId) {
    const file = actions.openFile(fileId);

    if (!file) {
      return null;
    }

    setTabs((current) => {
      const exists = current.find(
        (tab) => tab.id === file.id
      );

      if (exists) {
        return current;
      }

      return [...current, file];
    });

    setActiveTab(file.id);

    return file;
  }

  function closeTab(fileId) {
    setTabs((current) => {
      const next = current.filter(
        (tab) => tab.id !== fileId
      );

      if (activeTab === fileId) {
        setActiveTab(
          next.length
            ? next[next.length - 1].id
            : null
        );
      }

      return next;
    });
  }

  const value = {
    tree,

    refresh,

    actions,

    selectedNodeId,
    setSelectedNodeId,

    tabs,
    activeTab,
    setActiveTab,

    openFile,
    closeTab,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
}

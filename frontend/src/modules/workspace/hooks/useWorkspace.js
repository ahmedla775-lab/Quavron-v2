import { useWorkspace as useWorkspaceContext } from "../context/WorkspaceContext";

export default function useWorkspace() {
  const context = useWorkspaceContext();

  const {
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
  } = context;

  function createFile(parentId, name, options = {}) {
    const file = actions.createFile(
      parentId,
      name,
      options
    );

    refresh();

    if (file) {
      openFile(file.id);
    }

    return file;
  }

  function createFolder(parentId, name) {
    const folder = actions.createFolder(
      parentId,
      name
    );

    refresh();

    return folder;
  }

  function rename(id, newName) {
    actions.rename(id, newName);

    refresh();
  }

  function remove(id) {
    actions.delete(id);

    refresh();
  }

  return {
    tree,

    actions,

    refresh,

    selectedNodeId,
    setSelectedNodeId,

    tabs,
    activeTab,
    setActiveTab,

    openFile,
    closeTab,

    createFile,
    createFolder,
    rename,
    remove,
  };
}

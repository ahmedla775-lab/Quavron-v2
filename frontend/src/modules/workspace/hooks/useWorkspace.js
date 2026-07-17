import { useWorkspace as useWorkspaceContext } from "../context/WorkspaceContext";

export default function useWorkspace() {

  const {

    tree,

    refresh,

    actions,

    activeFileId,

    setActiveFileId,

    selectedNodeId,

    setSelectedNodeId,

  } = useWorkspaceContext();

  function createFile(

    parentId,

    name,

    options = {}

  ) {

    const file = actions.createFile(

      parentId,

      name,

      options

    );

    refresh();

    return file;

  }

  function createFolder(

    parentId,

    name

  ) {

    const folder = actions.createFolder(

      parentId,

      name

    );

    refresh();

    return folder;

  }

  function rename(

    id,

    newName

  ) {

    actions.rename(

      id,

      newName

    );

    refresh();

  }

  function remove(id) {

    actions.delete(id);

    refresh();

  }

  return {

    tree,

    activeFileId,

    setActiveFileId,

    selectedNodeId,

    setSelectedNodeId,

    createFile,

    createFolder,

    rename,

    remove,

    actions,

    refresh,

  };

}

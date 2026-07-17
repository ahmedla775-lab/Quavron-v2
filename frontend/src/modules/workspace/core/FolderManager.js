class FolderManager {

  constructor(treeManager) {

    this.treeManager = treeManager;

  }

  create(parentId, name) {

    return this.treeManager.createFolder(

      parentId,

      name

    );

  }

  rename(folderId, newName) {

    this.treeManager.rename(

      folderId,

      newName

    );

    return this.treeManager.getNode(folderId);

  }

  delete(folderId) {

    this.treeManager.delete(folderId);

  }

  get(folderId) {

    return this.treeManager.getNode(folderId);

  }

  getChildren(folderId) {

    const folder = this.treeManager.getNode(folderId);

    if (!folder || folder.type !== "folder") {

      return [];

    }

    return folder.children || [];

  }

  move(nodeId, targetFolderId) {

    throw new Error(

      "Move operation will be implemented in Workspace Engine v2.1"

    );

  }

}

export default FolderManager;

import TreeManager from "./TreeManager";
import FileManager from "./FileManager";
import FolderManager from "./FolderManager";
import WorkspaceSerializer from "./WorkspaceSerializer";

class WorkspaceActions {

  constructor(tree = []) {

    this.treeManager =
      new TreeManager(tree);

    this.fileManager =
      new FileManager(
        this.treeManager
      );

    this.folderManager =
      new FolderManager(
        this.treeManager
      );

  }

  getTree() {

    return this.treeManager.getTree();

  }

  setTree(tree) {

    this.treeManager.setTree(tree);

  }

  getNode(id) {

    return this.treeManager.getNode(id);

  }

  getAllNodes() {

    return this.treeManager.getAllNodes();

  }

  createFile(parentId, name, options = {}) {

    return this.treeManager.createFile(

      parentId,

      name,

      options

    );

  }

  createFolder(parentId, name) {

    return this.folderManager.create(

      parentId,

      name

    );

  }

  rename(id, newName) {

    return this.treeManager.rename(

      id,

      newName

    );

  }

  delete(id) {

    return this.treeManager.delete(id);

  }

  openFile(id) {

    return this.fileManager.open(id);

  }

  saveFile(id, content) {

    return this.fileManager.save(

      id,

      content

    );

  }

  duplicateFile(id) {

    return this.fileManager.duplicate(id);

  }

  changeLanguage(id, language) {

    return this.fileManager.changeLanguage(

      id,

      language

    );

  }

  exportWorkspace() {

    return WorkspaceSerializer.export(

      this.treeManager.getTree()

    );

  }

  importWorkspace(serialized) {

    const tree =

      WorkspaceSerializer.import(

        serialized

      );

    if (tree) {

      this.treeManager.setTree(tree);

    }

    return tree;

  }

  saveLocal(key = "quavron-workspace") {

    WorkspaceSerializer.saveLocal(

      key,

      this.treeManager.getTree()

    );

  }

  loadLocal(key = "quavron-workspace") {

    const tree =

      WorkspaceSerializer.loadLocal(key);

    if (tree) {

      this.treeManager.setTree(tree);

    }

    return tree;

  }

}

export default WorkspaceActions;

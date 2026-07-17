import {
  addNode,
  findNode,
  flattenTree,
  removeNode,
  renameNode,
} from "../utils/treeHelpers";

import {
  createFile,
  createFolder,
} from "../utils/uuid";

class TreeManager {

  constructor(tree = []) {

    this.tree = tree;

  }

  getTree() {

    return this.tree;

  }

  setTree(tree) {

    this.tree = tree;

    return this.tree;

  }

  getNode(id) {

    return findNode(this.tree, id);

  }

  getAllNodes() {

    return flattenTree(this.tree);

  }

  createFile(parentId, name, options = {}) {

    const file = createFile({

      name,

      content: options.content || "",

      language:
        options.language || "plaintext",

    });

    this.tree = addNode(
      this.tree,
      parentId,
      file
    );

    return file;

  }

  createFolder(parentId, name) {

    const folder =
      createFolder(name);

    this.tree = addNode(
      this.tree,
      parentId,
      folder
    );

    return folder;

  }

  rename(id, newName) {

    this.tree = renameNode(
      this.tree,
      id,
      newName
    );

    return this.tree;

  }

  delete(id) {

    this.tree = removeNode(
      this.tree,
      id
    );

    return this.tree;

  }

}

export default TreeManager;

import { useMemo, useState } from "react";

import useWorkspace from "./useWorkspace";

import { searchTree } from "../utils/searchTree";

export default function useExplorer() {

  const {

    tree,

    createFile,

    createFolder,

    rename,

    remove,

    actions,

  } = useWorkspace();

  const [search, setSearch] =
    useState("");

  const filteredTree =
    useMemo(

      () =>

        searchTree(

          tree,

          search

        ),

      [tree, search]

    );

  const nodes =
    useMemo(

      () =>

        actions.getAllNodes(),

      [tree]

    );

  function getNode(id) {

    return actions.getNode(id);

  }

  function getChildren(id) {

    const node =
      actions.getNode(id);

    if (
      !node ||
      node.type !== "folder"
    ) {

      return [];

    }

    return node.children || [];

  }

  return {

    tree: filteredTree,

    rawTree: tree,

    nodes,

    search,

    setSearch,

    getNode,

    getChildren,

    createFile,

    createFolder,

    rename,

    remove,

  };

}

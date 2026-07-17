import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import WorkspaceActions from "../core/WorkspaceActions";

const WorkspaceContext =
  createContext(null);

export function WorkspaceProvider({

  children,

}) {

  const [tree, setTree] =
    useState([]);

  const [activeFileId, setActiveFileId] =
    useState(null);

  const [selectedNodeId, setSelectedNodeId] =
    useState(null);

  const actions =
    useMemo(

      () => new WorkspaceActions(tree),

      []

    );

  useEffect(() => {

    const saved =
      actions.loadLocal();

    if (saved) {

      setTree([
        ...saved,
      ]);

    }

  }, []);

  function refresh() {

    const next = [

      ...actions.getTree(),

    ];

    setTree(next);

    actions.saveLocal();

  }

  const value = {

    tree,

    activeFileId,

    setActiveFileId,

    selectedNodeId,

    setSelectedNodeId,

    refresh,

    actions,

  };

  return (

    <WorkspaceContext.Provider
      value={value}
    >

      {children}

    </WorkspaceContext.Provider>

  );

}

export function useWorkspace() {

  const context =
    useContext(
      WorkspaceContext
    );

  if (!context) {

    throw new Error(

      "useWorkspace must be used inside WorkspaceProvider"

    );

  }

  return context;

}

import {
  createContext,
  useContext,
  useState,
} from "react";

const WorkspaceContext =
  createContext();

export function WorkspaceProvider({

  children,

}) {

  const [tabs, setTabs] =
    useState([
      {
        id: "app",
        name: "App.jsx",
      },
    ]);

  const [activeTab, setActiveTab] =
    useState("app");

  function openFile(file) {

    const exists = tabs.find(
      (t) => t.id === file.id
    );

    if (!exists) {

      setTabs((old) => [

        ...old,

        file,

      ]);

    }

    setActiveTab(file.id);

  }

  function closeTab(id) {

    const updated =
      tabs.filter(
        (t) => t.id !== id
      );

    setTabs(updated);

    if (
      activeTab === id &&
      updated.length
    ) {

      setActiveTab(
        updated[
          updated.length - 1
        ].id
      );

    }

  }

  return (

    <WorkspaceContext.Provider
      value={{
        tabs,
        activeTab,
        openFile,
        closeTab,
        setActiveTab,
      }}
    >

      {children}

    </WorkspaceContext.Provider>

  );

}

export function useWorkspace() {

  return useContext(
    WorkspaceContext
  );

}

import {
  createContext,
  useContext,
  useState,
} from "react";

const TabContext = createContext(null);

export function TabProvider({ children }) {

  const [tabs, setTabs] = useState([]);

  const [activeTab, setActiveTab] = useState(null);

  function openTab(file) {

    setTabs((prev) => {

      if (prev.find((t) => t.id === file.id))
        return prev;

      return [...prev, file];

    });

    setActiveTab(file);

  }

  function closeTab(id) {

    setTabs((prev) =>
      prev.filter((t) => t.id !== id)
    );

    if (activeTab?.id === id) {
      setActiveTab(null);
    }

  }

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTab,
        openTab,
        closeTab,
        setActiveTab,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  return useContext(TabContext);
}


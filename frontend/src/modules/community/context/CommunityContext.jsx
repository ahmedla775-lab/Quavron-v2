import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const CommunityContext = createContext(null);

export function CommunityProvider({ children }) {

  const [feed, setFeed] = useState([]);

  const [selectedPlatform, setSelectedPlatform] =
    useState("All");

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const value = useMemo(
    () => ({
      feed,
      setFeed,

      selectedPlatform,
      setSelectedPlatform,

      loading,
      setLoading,

      refreshing,
      setRefreshing,
    }),
    [
      feed,
      selectedPlatform,
      loading,
      refreshing,
    ]
  );

  return (

    <CommunityContext.Provider value={value}>

      {children}

    </CommunityContext.Provider>

  );

}

export function useCommunity() {

  const context =
    useContext(CommunityContext);

  if (!context) {

    throw new Error(
      "useCommunity must be used inside CommunityProvider"
    );

  }

  return context;

}

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import FeedService from "../services/FeedService";

export const SocialHubContext = createContext(null);

export function SocialHubProvider({ children }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await FeedService.getFeed();

      setFeed(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      feed,
      loading,
      error,
      refresh,
    }),
    [feed, loading, error, refresh]
  );

  return (
    <SocialHubContext.Provider value={value}>
      {children}
    </SocialHubContext.Provider>
  );
}

export default SocialHubProvider;

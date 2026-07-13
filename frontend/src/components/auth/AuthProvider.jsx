import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getSession,
  getUser,
  onAuthStateChange,
} from "../../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function initialize() {
      const { data } = await getSession();

      setSession(data.session);

      if (data.session) {
        const userData = await getUser();
        setUser(userData.data.user);
      }

      setLoading(false);
    }

    initialize();

    const {
      data: listener,
    } = onAuthStateChange(
      async (_event, session) => {

        setSession(session);

        if (session) {
          const userData = await getUser();
          setUser(userData.data.user);
        } else {
          setUser(null);
        }

      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


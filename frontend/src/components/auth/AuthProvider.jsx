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

import ProfileService from "../../services/ProfileService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId) {

    const { data } =
      await ProfileService.getProfile(userId);

    setProfile(data);

  }

  useEffect(() => {

    async function initialize() {

      const { data } =
        await getSession();

      setSession(data.session);

      if (data.session) {

        const userData =
          await getUser();

        setUser(userData.data.user);

        await loadProfile(
          userData.data.user.id
        );

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

          const userData =
            await getUser();

          setUser(userData.data.user);

          await loadProfile(
            userData.data.user.id
          );

        } else {

          setUser(null);
          setProfile(null);

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
        profile,
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

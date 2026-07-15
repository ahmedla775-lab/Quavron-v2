import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import ProfileService from "../services/ProfileService";
import { useAuth } from "../components/auth/AuthProvider";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(false);

  async function loadProfile(id) {

    if (!id) return;

    setLoading(true);

    try {

      const { data, error } =
        await ProfileService.getProfile(id);

      if (error) throw error;

      setProfile(data);

    } catch (error) {

      console.error("PROFILE ERROR:", error);

      setProfile(null);

    } finally {

      setLoading(false);

    }

  }

  async function updateProfile(values) {

    if (!profile) return;

    const { data, error } =
      await ProfileService.updateProfile(
        profile.id,
        values
      );

    if (error) throw error;

    setProfile(data);

  }

  useEffect(() => {

    if (user) {

      loadProfile(user.id);

    } else {

      setProfile(null);

    }

  }, [user]);

  return (

    <ProfileContext.Provider
      value={{
        profile,
        loading,
        loadProfile,
        updateProfile,
      }}
    >

      {children}

    </ProfileContext.Provider>

  );

}

export function useProfile() {

  const context = useContext(ProfileContext);

  if (!context) {

    throw new Error(
      "useProfile must be used inside ProfileProvider"
    );

  }

  return context;

}

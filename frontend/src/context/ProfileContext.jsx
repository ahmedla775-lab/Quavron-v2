import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../components/auth/AuthProvider";
import ProfileService from "../services/ProfileService";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  async function loadProfile(id) {

    if (!id) {

      setProfile(null);

      setLoading(false);

      return;

    }

    setLoading(true);

    try {

      const { data, error } =
        await ProfileService.getProfile(id);

      if (error) throw error;

      setProfile(data);

    } catch (error) {

      console.error(error);

      setProfile(null);

    } finally {

      setLoading(false);

    }

  }

  async function refreshProfile() {

    if (!user) return;

    await loadProfile(user.id);

  }

  async function saveProfile(values) {

    if (!profile) return;

    const { data, error } =
      await ProfileService.updateProfile(
        profile.id,
        values
      );

    if (error) throw error;

    setProfile(data);

    return data;

  }

  function updateLocalProfile(values) {

    setProfile((current) => ({

      ...current,

      ...values,

    }));

  }

  useEffect(() => {

    if (user) {

      loadProfile(user.id);

    } else {

      setProfile(null);

      setLoading(false);

    }

  }, [user]);

  return (

    <ProfileContext.Provider
      value={{

        profile,

        loading,

        refreshProfile,

        saveProfile,

        updateLocalProfile,

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

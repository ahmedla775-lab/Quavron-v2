import {
  createContext,
  useContext,
  useState,
} from "react";

import ProfileService from "../services/ProfileService";

const ProfileContext = createContext(null);

export function ProfileProvider({
  children,
}) {

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(false);

  async function loadProfile(id) {

    setLoading(true);

    try {

      const { data, error } =
        await ProfileService.getProfile(id);

      if (error) throw error;

      setProfile(data);

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

  return useContext(ProfileContext);

}

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../components/auth/AuthProvider";
import ProfileService from "../services/ProfileService";

const ProfileContext = createContext(null);

export function ProfileProvider({

  children,

}) {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [profileId, setProfileId] = useState(null);

  const [loading, setLoading] = useState(true);

  async function loadProfile(authId) {

    if (!authId) {

      setProfile(null);

      setProfileId(null);

      setLoading(false);

      return;

    }

    setLoading(true);

    try {

      const {

        data,

        error,

      } = await ProfileService.getProfile(authId);

      if (error) throw error;

      setProfile(data);

      setProfileId(data.id);

    } catch (error) {

      console.error(error);

      setProfile(null);

      setProfileId(null);

    } finally {

      setLoading(false);

    }

  }

  async function refreshProfile() {

    if (!user) return;

    await loadProfile(user.id);

  }

  async function saveProfile(values) {

    if (!profileId) return;

    const {

      data,

      error,

    } = await ProfileService.updateProfile(

      profileId,

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

  async function updateAvatar(file) {

    if (!profileId) return;

    const url = await ProfileService.uploadAvatar(

      profileId,

      file

    );

    await saveProfile({

      avatar_url: url,

    });

    return url;

  }

  async function updateCover(file) {

    if (!profileId) return;

    const url = await ProfileService.uploadCover(

      profileId,

      file

    );

    await saveProfile({

      cover_url: url,

    });

    return url;

  }

  useEffect(() => {

    if (user) {

      loadProfile(user.id);

    } else {

      setProfile(null);

      setProfileId(null);

      setLoading(false);

    }

  }, [user]);
  return (

    <ProfileContext.Provider

      value={{

        profile,

        profileId,

        loading,

        refreshProfile,

        saveProfile,

        updateLocalProfile,

        updateAvatar,

        updateCover,

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

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";
import SettingsService from "../services/SettingsService";

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {

  account: {},

  profile: {},

  security: {},

  privacy: {},

  notifications: {},

  appearance: {
    theme: "dark",
  },

  language: {
    language: "en",
  },

  verification: {},

  community: {},

  ai: {},

  ide: {},

  hosting: {},

  marketplace: {},

  developer: {},

  billing: {},

  api: {},

};

export function SettingsProvider({

  children,

}) {

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [lastSaved, setLastSaved] =
    useState(null);

  const [userId, setUserId] =
    useState(null);

  const saveTimeout = useRef(null);

  useEffect(() => {

    initialize();

  }, []);

  async function initialize() {

    const {
      data,
    } = await supabase.auth.getUser();

    if (!data?.user) {

      setLoading(false);

      return;

    }

    setUserId(data.user.id);

    const profile = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", data.user.id)
      .single();

    if (!profile.data) {

      setLoading(false);

      return;

    }

    const profileId = profile.data.id;

    setUserId(profileId);

    const response =
      await SettingsService.getSettings(profileId);

    if (response.data) {

      setSettings({

        ...DEFAULT_SETTINGS,

        ...response.data.settings,

      });

    } else {

      await SettingsService.createDefaultSettings(

        profileId,

        DEFAULT_SETTINGS

      );

      setSettings(DEFAULT_SETTINGS);

    }

    setLoading(false);

  }

  async function save(nextSettings) {

    if (!userId) return;

    setSaving(true);

    setSettings(nextSettings);

    await SettingsService.saveSettings(

      userId,

      nextSettings

    );

    setSaving(false);

    setLastSaved(new Date());

  }

  function autoSave(nextSettings) {

    setSettings(nextSettings);

    if (saveTimeout.current) {

      clearTimeout(saveTimeout.current);

    }

    saveTimeout.current = setTimeout(() => {

      save(nextSettings);

    }, 500);

  }

  function updateSection(

    section,

    values

  ) {

    const next = {

      ...settings,

      [section]: {

        ...settings[section],

        ...values,

      },

    };

    autoSave(next);

  }

  async function reset() {

    setSettings(DEFAULT_SETTINGS);

    if (userId) {

      await SettingsService.resetSettings(

        userId

      );

    }

    setLastSaved(new Date());

  }
  return (

    <SettingsContext.Provider

      value={{

        settings,

        loading,

        saving,

        lastSaved,

        save,

        reset,

        updateSection,

      }}

    >

      {children}

    </SettingsContext.Provider>

  );

}

export function useSettings() {

  const context = useContext(SettingsContext);

  if (!context) {

    throw new Error(

      "useSettings must be used inside SettingsProvider"

    );

  }

  return context;

}

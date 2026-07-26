import {
  createContext,
  useContext,
  useEffect,
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

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState(null);

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

    const response =
      await SettingsService.get(data.user.id);

    if (response.data) {

      setSettings({

        ...DEFAULT_SETTINGS,

        ...response.data.settings,

      });

    } else {

      await SettingsService.create(data.user.id);

    }

    setLoading(false);

  }

  async function save(nextSettings) {

    if (!userId) return;

    setSettings(nextSettings);

    await SettingsService.save(

      userId,

      nextSettings,

    );

  }

  async function updateSection(

    section,

    values,

  ) {

    const next = {

      ...settings,

      [section]: {

        ...settings[section],

        ...values,

      },

    };

    setSettings(next);

    if (userId) {

      await SettingsService.save(

        userId,

        next,

      );

    }

  }

  async function reset() {

    setSettings(DEFAULT_SETTINGS);

    if (userId) {

      await SettingsService.reset(userId);

    }

  }

  return (

    <SettingsContext.Provider
      value={{

        settings,

        loading,

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

  return useContext(SettingsContext);

}

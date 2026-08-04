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
    accent: "green",
    fontSize: "medium",
    density: "comfortable",
    sidebar: "expanded",
    animations: true,
    glass: true,
    transparency: true,
    rounded: true,
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

export function SettingsProvider({ children }) {

  const [settings, setSettings] = useState(() => {

    const saved = localStorage.getItem("settings");

    if (!saved) return DEFAULT_SETTINGS;

    try {

      const parsed = JSON.parse(saved);

      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        appearance: {
          ...DEFAULT_SETTINGS.appearance,
          ...(parsed.appearance || {}),
        },
      };

    } catch {

      return DEFAULT_SETTINGS;

    }

  });


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [userId, setUserId] = useState(null);

  const saveTimeout = useRef(null);


  useEffect(() => {

    const cached = localStorage.getItem("settings");

    if (cached) {

      try {

        const parsed = JSON.parse(cached);

        const merged = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          appearance:{
            ...DEFAULT_SETTINGS.appearance,
            ...(parsed.appearance || {}),
          },
        };

        setSettings(merged);
        applySettings(merged);

      } catch(e) {

        console.log("settings cache error");

      }

    }

    initialize();

  }, []);



  async function initialize(){

    const {
      data,
    } = await supabase.auth.getUser();


    if(!data?.user){

      setLoading(false);
      return;

    }


    setUserId(data.user.id);


    const profile = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", data.user.id)
      .single();


    if(!profile.data){

      setLoading(false);
      return;

    }


    const response =
      await SettingsService.getSettings(profile.data.id);


    if(response.data){

      const loadedSettings = {

        ...DEFAULT_SETTINGS,

        ...response.data.settings,

        appearance:{
          ...DEFAULT_SETTINGS.appearance,
          ...(response.data.settings?.appearance || {}),
        },

      };


      setSettings(loadedSettings);

      localStorage.setItem(
        "settings",
        JSON.stringify(loadedSettings)
      );


      applySettings(loadedSettings);


    } else {


      await SettingsService.createDefaultSettings(
        profile.data.id,
        DEFAULT_SETTINGS
      );


      setSettings(DEFAULT_SETTINGS);

      applySettings(DEFAULT_SETTINGS);

    }


    setLoading(false);

  }



  async function save(nextSettings){

    if(!userId) return;


    setSaving(true);


    setSettings(nextSettings);

    applySettings(nextSettings);


    localStorage.setItem(
      "settings",
      JSON.stringify(nextSettings)
    );


    await SettingsService.saveSettings(
      userId,
      nextSettings
    );


    setSaving(false);

    setLastSaved(new Date());

  }



  function applySettings(next){

    const root = document.documentElement;

    const appearance = next.appearance || {};


    if(appearance.fontSize){

      root.dataset.fontSize =
        appearance.fontSize;

    }


    if(appearance.density){

      root.dataset.density =
        appearance.density;

    }


    if(appearance.sidebar){

      root.dataset.sidebar =
        appearance.sidebar;

    }


    root.dataset.animations =
      appearance.animations ? "on" : "off";


    root.dataset.glass =
      appearance.glass ? "on" : "off";


    root.dataset.transparency =
      appearance.transparency ? "on" : "off";


    root.dataset.rounded =
      appearance.rounded ? "on" : "off";



    const colors = {

      blue:"#1E88E5",
      purple:"#9333EA",
      green:"#16A34A",
      orange:"#EA580C",
      red:"#DC2626",
      pink:"#DB2777",

    };


    root.style.setProperty(
      "--q-primary",
      colors[appearance.accent] || colors.green
    );


    root.style.setProperty(
      "--q-accent",
      colors[appearance.accent] || colors.green
    );

  }



  function autoSave(nextSettings){

    setSettings(nextSettings);

    applySettings(nextSettings);


    if(saveTimeout.current){

      clearTimeout(saveTimeout.current);

    }


    saveTimeout.current = setTimeout(()=>{

      save(nextSettings);

    },500);

  }



  function updateSection(section, values){

    const next = {

      ...settings,

      [section]:{

        ...settings[section],

        ...values,

      },

    };


    autoSave(next);

  }



  async function reset(){

    setSettings(DEFAULT_SETTINGS);

    applySettings(DEFAULT_SETTINGS);


    localStorage.setItem(
      "settings",
      JSON.stringify(DEFAULT_SETTINGS)
    );


    if(userId){

      await SettingsService.resetSettings(userId);

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



export function useSettings(){

  const context = useContext(SettingsContext);


  if(!context){

    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );

  }


  return context;

}

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const ThemeContext = createContext(null);



const themes = {

  dark: {

    "--q-bg": "#0B0D10",
    "--q-surface": "#11151B",
    "--q-card": "#161B22",
"--q-comment": "#0E1319",
    "--q-border": "#2A313A",

    "--q-text": "#FFFFFF",
    "--q-muted": "#9CA3AF",

    "--q-primary": "#16A34A",
    "--q-primary-rgb": "22,163,74",
    "--q-glow": "0 0 20px rgba(22,163,74,.35)",
    "--q-accent": "#16A34A",

    "--q-silver": "#D9DDE3",

  },


  light: {

    "--q-bg": "#F8FAFC",
    "--q-surface": "#FFFFFF",
    "--q-card": "#FFFFFF",
"--q-comment": "#F1F5F9",
    "--q-border": "#D9DDE3",

    "--q-text": "#0B0D10",
    "--q-muted": "#64748B",

    "--q-primary": "#16A34A",
    "--q-primary-rgb": "22,163,74",
    "--q-glow": "0 0 20px rgba(22,163,74,.35)",
    "--q-accent": "#16A34A",

    "--q-silver": "#6B7280",

  },

};



export function ThemeProvider({ children }) {


  const [theme,setTheme] = useState(()=>{

    return (
      localStorage.getItem("theme")
      ||
      "dark"
    );

  });



  useEffect(()=>{


    localStorage.setItem(
      "theme",
      theme
    );


    const root =
      document.documentElement;


    root.classList.remove(
      "dark",
      "light"
    );


    root.classList.add(
      theme
    );



    Object.entries(
      themes[theme]
    )
    .forEach(
      ([key,value])=>{

        root.style.setProperty(
          key,
          value
        );

      }
    );


  },[theme]);




  const toggleTheme=()=>{

    setTheme(
      current =>
      current==="dark"
      ?
      "light"
      :
      "dark"
    );

  };





  const value = useMemo(()=>({

    theme,

    setTheme,

    toggleTheme,

    isDark:
      theme==="dark",

    isLight:
      theme==="light",


  }),[theme]);




  return (

    <ThemeContext.Provider value={value}>

      {children}

    </ThemeContext.Provider>

  );

}




export function useTheme(){


  const context =
    useContext(
      ThemeContext
    );


  if(!context){

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );

  }


  return context;


}

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
    "--q-primary": "#2563EB",
    "--q-primary-rgb": "37,99,235",
    "--q-glow": "0 0 25px rgba(37,99,235,.35)",
    "--q-accent": "#38BDF8",
    "--q-silver": "#D9DDE3",
  },

  light: {
    "--q-bg": "#F8FCFF",
    "--q-surface": "#FFFFFF",
    "--q-card": "#F4FAFF",
    "--q-comment": "#EAF6FF",
    "--q-border": "#CFE8FF",
    "--q-text": "#07111F",
    "--q-muted": "#64748B",
    "--q-primary": "#2563EB",
    "--q-primary-rgb": "37,99,235",
    "--q-glow": "0 0 25px rgba(37,99,235,.25)",
    "--q-accent": "#0EA5E9",
    "--q-silver": "#94A3B8",
  },
};

export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {

    localStorage.setItem("theme", theme);

    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(theme);

    Object.entries(themes[theme]).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

  }, [theme]);


  const toggleTheme = () => {
    setTheme(current =>
      current === "dark" ? "light" : "dark"
    );
  };


  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }), [theme]);


  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme(){

  const context = useContext(ThemeContext);

  if(!context){
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}

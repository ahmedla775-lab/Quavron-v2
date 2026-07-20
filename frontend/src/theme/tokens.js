import themes from "./themes";

export function getThemeTokens(theme = "dark") {
  return themes[theme] || themes.dark;
}

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
};

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
};

export const shadow = {
  sm: "0 1px 2px rgba(0,0,0,.08)",
  md: "0 6px 16px rgba(0,0,0,.12)",
  lg: "0 12px 28px rgba(0,0,0,.18)",
};

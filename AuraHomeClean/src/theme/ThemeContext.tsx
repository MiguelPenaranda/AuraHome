import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "light" | "dark";

export type ThemePalette = {
  primary: string;
  background: string;
  surface: string;
  text: string;
};

export type ThemeDefinition = {
  mode: ThemeMode;
  colors: ThemePalette;
};

const themes: Record<ThemeMode, ThemeDefinition> = {
  light: {
    mode: "light",
    colors: {
      primary: "#3B82F6",
      background: "#F6F8FB",
      surface: "#FFFFFF",
      text: "#0F172A",
    },
  },
  dark: {
    mode: "dark",
    colors: {
      primary: "#60A5FA",
      background: "#0B1221",
      surface: "#0F172A",
      text: "#E5E7EB",
    },
  },
};

export type ThemeContextValue = {
  theme: ThemeDefinition;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getPreferredMode = (): ThemeMode => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getPreferredMode);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setMode(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setMode((current) => (current === "light" ? "dark" : "light"));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[mode],
      mode,
      toggleTheme,
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { themes, ThemeContext };

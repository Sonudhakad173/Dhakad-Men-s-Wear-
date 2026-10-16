import React, { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme-context.js";

const THEME_STORAGE_KEY = "dhakad_theme_v1";

function applyThemeToDocument(mode) {
  const isDark = mode === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function readInitialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // ignore
  }

  return "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => (typeof window === "undefined" ? "light" : readInitialTheme()));

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
    applyThemeToDocument(mode);
  }, [mode]);

  const api = useMemo(() => {
    return {
      mode,
      isDark: mode === "dark",
      setMode,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    };
  }, [mode]);

  return <ThemeContext.Provider value={api}>{children}</ThemeContext.Provider>;
}
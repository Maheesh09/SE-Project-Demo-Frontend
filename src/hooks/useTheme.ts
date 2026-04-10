import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "mindup-theme";

/** Read the current theme directly from the DOM. */
const readDOMTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  // Respect OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/**
 * Apply the chosen theme to the <html> element and persist it.
 * This is a standalone helper so the toggle and all hook instances
 * share the same single source of truth: the DOM class list.
 */
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.add("theme-transitioning");
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, theme);
  setTimeout(() => root.classList.remove("theme-transitioning"), 350);
};

export const useTheme = () => {
  // Initialise from DOM so all instances agree from the start
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getInitialTheme();
    // Eagerly apply so the DOM is correct before first paint
    if (typeof window !== "undefined") applyTheme(initial);
    return initial;
  });

  // Keep local state in sync with any external DOM changes
  // (e.g. another instance of the hook calling toggleTheme)
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const domTheme = readDOMTheme();
      setThemeState((prev) => (prev !== domTheme ? domTheme : prev));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = readDOMTheme() === "light" ? "dark" : "light";
    applyTheme(next);
    setThemeState(next);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    applyTheme(t);
    setThemeState(t);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
};

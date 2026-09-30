import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DashboardTheme = "light" | "dark";

type DashboardThemeContextValue = {
  theme: DashboardTheme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "zistup-dashboard-theme";

export const DashboardThemeContext =
  createContext<DashboardThemeContextValue | null>(null);

const readTheme = (): DashboardTheme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<DashboardTheme>(readTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.dashboardTheme = theme;
  }, [theme]);

  useLayoutEffect(() => {
    return () => {
      delete document.documentElement.dataset.dashboardTheme;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Keep switching available when browser storage is disabled or full.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <DashboardThemeContext.Provider value={value}>
      {children}
    </DashboardThemeContext.Provider>
  );
};

export default DashboardThemeProvider;

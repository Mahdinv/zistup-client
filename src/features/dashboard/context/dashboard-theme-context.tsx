import {
  createContext,
  useCallback,
  useEffect,
  useInsertionEffect,
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

export const readDashboardTheme = (): DashboardTheme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const DashboardThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<DashboardTheme>(readDashboardTheme);

  // Apply theme styles before descendants measure layout. Otherwise those reads
  // can resolve light styles and start a color transition on a dark-theme mount.
  useInsertionEffect(() => {
    document.documentElement.dataset.dashboardTheme = theme;
    return () => {
      delete document.documentElement.dataset.dashboardTheme;
    };
  }, [theme]);

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

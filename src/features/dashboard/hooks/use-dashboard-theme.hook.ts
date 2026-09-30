import { useContext } from "react";
import { DashboardThemeContext } from "../context/dashboard-theme-context";

export const useDashboardTheme = () => {
  const context = useContext(DashboardThemeContext);

  if (!context) {
    throw new Error(
      "useDashboardTheme must be used within DashboardThemeProvider",
    );
  }

  return context;
};

import { useOutletContext } from "react-router-dom";

export type DashboardOutletContext = {
  openQuickAddMeal: () => void;
  setDashboardDate: (date: string | null) => void;
};

export const useQuickAddMealDrawer = () =>
  useOutletContext<DashboardOutletContext>();

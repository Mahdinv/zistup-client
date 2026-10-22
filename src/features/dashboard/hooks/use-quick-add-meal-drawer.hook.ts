import { useOutletContext } from "react-router-dom";

export type DashboardOutletContext = {
  openQuickAddMeal: () => void;
};

export const useQuickAddMealDrawer = () =>
  useOutletContext<DashboardOutletContext>();

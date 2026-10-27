import useUserProfileQuery from "@/shared/hooks/use-user-profile-query.hook";
import { useCallback, useState } from "react";
import type { DashboardOutletContext } from "@/features/dashboard/hooks/use-quick-add-meal-drawer.hook";
import DashboardThemeProvider from "@/features/dashboard/context/dashboard-theme-context";
import { useLocation, useOutlet } from "react-router-dom";
import {
  formatPlanDateForApi,
  getTehranCalendarDate,
} from "@/features/dashboard/lib/plan-date.utils";

import DashboardFlowBottomNav from "./dashboard-flow-bottom-nav";
import DashboardFlowContainer from "./dashboard-flow-container";

const DashboardFlowContent = () => {
  useUserProfileQuery();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dashboardDate, updateDashboardDate] = useState<string | null>(null);
  const setDashboardDate = useCallback((date: string | null) => {
    updateDashboardDate(date);
    setDrawerOpen(false);
  }, []);
  const today = formatPlanDateForApi(getTehranCalendarDate());
  const registrationDate =
    pathname === "/app/dashboard" ? dashboardDate : today;
  const registrationDisabled = registrationDate !== today;
  const openQuickAddMeal = useCallback(() => {
    if (!registrationDisabled) setDrawerOpen(true);
  }, [registrationDisabled]);
  const outlet = useOutlet({
    openQuickAddMeal,
    setDashboardDate,
  } satisfies DashboardOutletContext);

  return (
    <div
      data-dashboard-page={pathname === "/app/dashboard" ? "true" : undefined}
      className="dashboard-theme relative [--scroll-fade-color:var(--color-blue-100)] dark:[--scroll-fade-color:var(--color-darker-blue-200)]
        compact:w-full tablet:w-3/5 laptop:w-3/5 desktop:w-1/3
        mx-auto h-svh flex flex-col justify-start items-center bg-blue-300 dark:bg-darker-blue-500 text-dark scheme-light dark:text-white dark:scheme-dark overflow-hidden"
    >
      <div className="relative z-0 flex-1 min-h-0 overflow-hidden w-full">
        <DashboardFlowContainer pageKey={pathname}>
          {outlet}
        </DashboardFlowContainer>
      </div>

      <DashboardFlowBottomNav
        registrationDisabled={registrationDisabled}
        drawerOpen={drawerOpen}
        onOpen={openQuickAddMeal}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

const DashboardFlowLayout = () => (
  <DashboardThemeProvider>
    <DashboardFlowContent />
  </DashboardThemeProvider>
);

export default DashboardFlowLayout;

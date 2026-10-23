import useUserProfileQuery from "@/shared/hooks/use-user-profile-query.hook";
import { useCallback, useState } from "react";
import type { DashboardOutletContext } from "@/features/dashboard/hooks/use-quick-add-meal-drawer.hook";
import DashboardThemeProvider from "@/features/dashboard/context/dashboard-theme-context";
import { useLocation, useOutlet } from "react-router-dom";

import DashboardFlowBottomNav from "./dashboard-flow-bottom-nav";
import DashboardFlowContainer from "./dashboard-flow-container";

const DashboardFlowContent = () => {
  useUserProfileQuery();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openQuickAddMeal = useCallback(() => setDrawerOpen(true), []);
  const outlet = useOutlet({
    openQuickAddMeal,
  } satisfies DashboardOutletContext);

  return (
    <div
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

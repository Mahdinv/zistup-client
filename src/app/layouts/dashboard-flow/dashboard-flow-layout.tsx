import DashboardThemeProvider from "@/features/dashboard/context/dashboard-theme-context";
import { useLocation, useOutlet } from "react-router-dom";
import DashboardFlowHeader from "./dashboard-flow-header";
import DashboardFlowBottomNav from "./dashboard-flow-bottom-nav";
import DashboardFlowContainer from "./dashboard-flow-container";

const DashboardFlowContent = () => {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  // const navigate = useNavigate();

  // const logoutHandler = () => {
  //   logout();
  //   navigate("/auth/login", { replace: true });
  // };
  return (
    <div
      className="dashboard-theme relative 
        compact:w-full tablet:w-3/5 laptop:w-2/5 desktop:w-1/3
        mx-auto h-svh flex flex-col justify-start items-center bg-blue-300 dark:bg-darker-blue-500 text-dark scheme-light dark:text-white dark:scheme-dark overflow-hidden"
    >
      <DashboardFlowHeader />
      <div className="flex-1 min-h-0 overflow-hidden w-full">
        <DashboardFlowContainer pageKey={pathname}>
          {outlet}
        </DashboardFlowContainer>
      </div>
      {/* <button
        type="button"
        className="text-red-400 dark:text-red-200 cursor-pointer px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={logoutHandler}
      >
        خروج
      </button> */}
      <DashboardFlowBottomNav />
    </div>
  );
};

const DashboardFlowLayout = () => (
  <DashboardThemeProvider>
    <DashboardFlowContent />
  </DashboardThemeProvider>
);

export default DashboardFlowLayout;

import DashboardThemeProvider from "@/features/dashboard/context/dashboard-theme-context";
import { logout } from "@/features/auth/api/auth.api";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardFlowHeader from "./dashboard-flow-header";

const DashboardFlowContent = () => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };
  return (
    <div className="relative w-full h-svh flex flex-col justify-start items-center bg-white text-dark scheme-light dark:bg-darker-blue-500 dark:text-white dark:scheme-dark transition-colors duration-150 motion-reduce:transition-none">
      <DashboardFlowHeader />
      <div className="flex-1 min-h-0 overflow-y-auto w-full bg-green-300 dark:bg-darker-blue-300 transition-colors duration-150 motion-reduce:transition-none">
        <Outlet />
      </div>
      <button
        type="button"
        className="text-red-400 dark:text-red-200 transition-colors duration-150 motion-reduce:transition-none cursor-pointer px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={logoutHandler}
      >
        خروج
      </button>
    </div>
  );
};

const DashboardFlowLayout = () => (
  <DashboardThemeProvider>
    <DashboardFlowContent />
  </DashboardThemeProvider>
);

export default DashboardFlowLayout;

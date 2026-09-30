import { useDashboardTheme } from "@/features/dashboard/hooks/use-dashboard-theme.hook";

const DashboardFlowHeader = () => {
  const { theme, toggleTheme } = useDashboardTheme();

  return (
    <header className="bg-blue-300 dark:bg-darker-blue-200 transition-colors duration-150 motion-reduce:transition-none w-full min-h-10 flex items-center px-3 py-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="تم تیره"
        aria-pressed={theme === "dark"}
        className="cursor-pointer rounded-sm px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {theme === "light" ? "تیره" : "روشن"}
      </button>
    </header>
  );
};

export default DashboardFlowHeader;

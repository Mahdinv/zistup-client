import { IoNotificationsOutline } from "react-icons/io5";
import { useDashboardTheme } from "@/features/dashboard/hooks/use-dashboard-theme.hook";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";

const DashboardFlowHeader = () => {
  const { theme, toggleTheme } = useDashboardTheme();

  return (
    <header
      className="bg-blue-100 dark:bg-darker-blue-400 border-b border-gray-300 dark:border-darker-blue-100 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.04)]
                w-full min-h-12 compact:px-4 fold:px-6 py-3
                flex flex-row justify-between items-center
            "
    >
      <IoNotificationsOutline className="text-blue-600 hover:text-blue-500 active:text-blue-500 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer" />
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="تم تیره"
        aria-pressed={theme === "dark"}
        className="cursor-pointer rounded-sm px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {theme === "light" ? "تیره" : "روشن"}
      </button>
      <div className="flex-1 justify-end flex flex-row items-center gap-1.5">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="font-yekan font-extrabold leading-[120%] compact:text-xl fold:text-2xl laptop:text-3xl text-black dark:text-white">
            پارسا متینی
          </h1>
          <small className="font-peyda font-medium leading-[150%] compact:text-xs fold:text-sm laptop:text-base text-blue-700">
            سطح دو : محافظ زمین
          </small>
        </div>
        <ImageWithSkeleton
          src="/pwa/default-user.webp"
          alt="default-user"
          wrapperClassName="compact:size-12 fold:size-13 laptop:size-14 rounded-full"
          className="w-full h-full object-contain pointer-events-none rounded-full border border-blue-500"
        />
      </div>
    </header>
  );
};

export default DashboardFlowHeader;

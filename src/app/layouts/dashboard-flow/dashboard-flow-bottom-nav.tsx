import { memo, useLayoutEffect, useRef } from "react";
import {
  PiBookOpen,
  PiBookOpenFill,
  PiPlus,
  PiSquaresFour,
  PiSquaresFourFill,
  PiStarFour,
  PiStarFourFill,
  PiUser,
  PiUserFill,
} from "react-icons/pi";
import { NavLink } from "react-router-dom";

const DashboardFlowBottomNav = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const plus = plusRef.current;
    const layout = nav?.parentElement;
    if (!nav || !plus || !layout) return;

    const updateBottomSpace = () => {
      const top = Math.min(
        nav.getBoundingClientRect().top,
        plus.getBoundingClientRect().top,
      );
      const height = Math.max(0, layout.getBoundingClientRect().bottom - top);
      layout.style.setProperty("--dashboard-bottom-space", `${height}px`);
    };

    updateBottomSpace();
    const observer = new ResizeObserver(updateBottomSpace);
    observer.observe(layout);
    observer.observe(nav);
    observer.observe(plus);
    window.addEventListener("resize", updateBottomSpace);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateBottomSpace);
      layout.style.removeProperty("--dashboard-bottom-space");
    };
  }, []);
  return (
    <div
      ref={navRef}
      className="absolute bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] compact:inset-x-4 mobile-lg:inset-x-10 fold:inset-x-14 tablet:inset-x-6
                   bg-blue-200 dark:bg-darker-blue-500 border border-green-200 dark:border-dark
                   rounded-4xl shadow-[0_0_20px_0_rgba(0,0,0,0.26)] py-3
                   grid grid-cols-5 items-center justify-items-center
       "
    >
      <div
        ref={plusRef}
        className="absolute -top-1/2 translate-y-1/5 cursor-pointer
                       bg-green-400 active:bg-green-500 hover:bg-green-500 shadow-[0_4px_12px_0_rgba(44,229,127,0.3)]
                       compact:size-14 mobile:size-16 fold:size-17 laptop:size-18
                       rounded-full flex justify-center items-center"
      >
        <PiPlus className="text-black compact:text-7xl fold:text-[34px] laptop:text-8xl" />
      </div>
      <NavLink
        to="/app/dashboard"
        className="w-full flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <PiSquaresFourFill className="text-green-400 compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            ) : (
              <PiSquaresFour className="text-black dark:text-white compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            )}

            <small
              className={`font-peyda font-bold leading-[120%]
                         ${isActive ? "text-green-400" : "text-black dark:text-white"}
                         compact:text-xs fold:text-sm laptop:text-base
                    `}
            >
              داشبورد
            </small>
          </>
        )}
      </NavLink>
      <NavLink
        to="/app/diet"
        className="w-full flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <PiBookOpenFill className="text-green-400 compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            ) : (
              <PiBookOpen className="text-black dark:text-white compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            )}

            <small
              className={`font-peyda font-bold leading-[120%] 
                          ${isActive ? "text-green-400" : "text-black dark:text-white"}
                          compact:text-xs fold:text-sm laptop:text-base
                        `}
            >
              رژیم
            </small>
          </>
        )}
      </NavLink>
      <div></div>
      <NavLink
        to="/app/zistyar"
        className="w-full flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <PiStarFourFill className="text-green-400 compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            ) : (
              <PiStarFour className="text-black dark:text-white compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            )}

            <small
              className={`font-peyda font-bold leading-[120%] 
                          ${isActive ? "text-green-400" : "text-black dark:text-white"}
                          compact:text-xs fold:text-sm laptop:text-base
                        `}
            >
              زیست‌یار
            </small>
          </>
        )}
      </NavLink>
      <NavLink
        to="/app/profile"
        className="w-full flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <PiUserFill className="text-green-400 compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            ) : (
              <PiUser className="text-black dark:text-white compact:text-7xl fold:text-[34px] laptop:text-8xl" />
            )}

            <small
              className={`font-peyda font-bold leading-[120%] 
                          ${isActive ? "text-green-400" : "text-black dark:text-white"}
                          compact:text-xs fold:text-sm laptop:text-base
                        `}
            >
              پروفایل
            </small>
          </>
        )}
      </NavLink>
    </div>
  );
};

export default memo(DashboardFlowBottomNav);

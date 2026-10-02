import { memo } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";

const Calendar = () => {
  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-4xl p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-row justify-between items-center
                "
    >
      <HiOutlineChevronRight
        className="compact:text-7xl fold:text-[36px] laptop:text-8xl cursor-pointer"
        strokeWidth={1.5}
      />
      <div className="flex-1 flex flex-row justify-center items-center gap-1.5">
        <LuCalendarDays
          className="compact:text-4xl fold:text-5xl laptop:text-6xl"
          strokeWidth={1.5}
        />
        <label className="font-peyda font-bold leading-[140%] compact:text-base fold:text-lg laptop:text-xl">
          سه شنبه
        </label>
        <label className="font-rokh font-bold leading-[140%] compact:text-lg fold:text-xl laptop:text-2xl mt-1">
          19
        </label>
        <label className="font-peyda font-bold leading-[140%] compact:text-base fold:text-lg laptop:text-xl">
          بهمن
        </label>
      </div>
      <HiOutlineChevronLeft
        className="compact:text-7xl fold:text-[36px] laptop:text-8xl cursor-pointer"
        strokeWidth={1.5}
      />
    </div>
  );
};

export default memo(Calendar);

import { memo } from "react";
import { PiTrash, PiXCircle } from "react-icons/pi";
import TodayLoggedMealCard from "./today-logged-meal-card";

const TodayLoggedMeals = () => {
  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-start gap-4
                "
    >
      <div
        className="
                  w-full
                  compact:min-h-6 fold:min-h-8 laptop:min-h-10
                  flex flex-row justify-between items-center
                "
      >
        <h2 className="flex-1 font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          وعده‌های ثبت‌شده امروز
        </h2>

        <div className="text-red-400 hover:text-red-500 active:text-red-500 flex flex-row justify-end items-center gap-1">
          <label className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg cursor-pointer">
            پاک کردن همه
          </label>
          <PiTrash
            className="compact:text-lg fold:text-xl laptop:text-2xl cursor-pointer"
            strokeWidth={1}
          />
        </div>
      </div>
      {/* <div className="w-full bg-transparent border-2 border-dashed border-gray-200 dark:border-darker-blue-100 rounded-xs p-8 flex justify-center items-center">
        <div className="text-green-400 hover:text-green-500 active:text-green-500 flex flex-row items-center gap-1 cursor-pointer">
          <h3 className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
            ثبت فعالیت امروز
          </h3>
          <LuArrowUpLeft
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={2.5}
          />
        </div>
      </div> */}
      <ol className="w-full flex flex-col items-center justify-start gap-4">
        <TodayLoggedMealCard />
        <TodayLoggedMealCard />
      </ol>
    </div>
  );
};

export default memo(TodayLoggedMeals);

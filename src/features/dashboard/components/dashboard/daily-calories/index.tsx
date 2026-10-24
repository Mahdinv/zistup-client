import { memo } from "react";
import CircularDailyCaloriesProgress from "./circular-daily-calories-progress";

const DailyCalories = () => {
  return (
    <div
      className="
        w-full
        bg-blue-100 dark:bg-darker-blue-400
        border border-gray-100 dark:border-dark
        rounded-2xl p-3
        shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
        flex flex-col items-center gap-4
      "
    >
      <h2 className="self-start font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
        کالری روزانه
      </h2>

      <CircularDailyCaloriesProgress value={10} />

      <div
        className="
          mt-auto w-full
          compact:min-h-8 fold:min-h-10 laptop:min-h-12 pt-1
          flex flex-row justify-center items-center
        "
      >
        <div className="text-orange-200 flex flex-row-reverse items-center gap-0.5">
          <label className="font-rokh font-extrabold leading-none compact:text-4xl mobile:text-5xl fold:text-[28px] laptop:text-6xl">
            1800
          </label>

          <small className="font-yekan font-normal leading-none compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
            kcal
          </small>
        </div>

        <label className="font-rokh font-extrabold leading-none compact:text-base mobile:text-lg fold:text-xl laptop:text-2xl text-blue-500 dark:text-darker-blue-100">
          /2200
        </label>
      </div>
    </div>
  );
};

export default memo(DailyCalories);

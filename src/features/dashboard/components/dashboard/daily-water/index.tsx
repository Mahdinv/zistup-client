import { memo } from "react";
import { PiPlusBold } from "react-icons/pi";

import AnimatedWaveCircle from "./animated-wave-circle";

const DailyWater = () => {
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
      <div
        className="
          w-full
          compact:min-h-6 fold:min-h-8 laptop:min-h-10
          flex flex-row justify-between items-center
        "
      >
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          آب روزانه
        </h2>

        <div className="text-blue-500 flex flex-row justify-end items-center gap-1">
          <label className="font-rokh font-bold leading-none compact:text-base mobile-lg:text-lg fold:text-xl laptop:text-2xl">
            8/4
          </label>

          <label className="font-peyda font-bold leading-none compact:text-xxs mobile:text-xs fold:text-sm laptop:text-base">
            لیوان
          </label>
        </div>
      </div>

      <AnimatedWaveCircle />

      <div
        className="
          mt-auto w-full
          compact:min-h-8 fold:min-h-10 laptop:min-h-12
          bg-blue-200 dark:bg-darker-blue-300 hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-darker-blue-400 dark:active:bg-darker-blue-400
          text-blue-400 hover:text-blue-500 active:text-blue-500
          border-[1.5px] border-blue-300 dark:border-dark
          rounded-[37px]
          flex flex-row justify-center items-center gap-2 cursor-pointer
        "
      >
        <PiPlusBold
          className="compact:text-2xl fold:text-3xl laptop:text-4xl"
          strokeWidth={4}
        />

        <label className="font-peyda font-bold leading-none compact:text-sm fold:text-base laptop:text-lg">
          یک لیوان
        </label>
      </div>
    </div>
  );
};

export default memo(DailyWater);

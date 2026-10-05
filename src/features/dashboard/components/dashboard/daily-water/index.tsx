import { memo } from "react";
import AnimatedWaveCircle from "./animated-wave-circle";
import { PiPlusBold } from "react-icons/pi";

const DailyWater = () => {
  return (
    <div
      className="
                        w-full
                        bg-blue-100 dark:bg-darker-blue-400
                        border border-gray-100 dark:border-dark
                        rounded-2xl p-3 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                        flex flex-col justify-center items-center gap-4
                    "
    >
      <div className="w-full flex flex-row justify-between items-center">
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          آب روزانه
        </h2>
        <div className="text-blue-500 flex flex-row justify-end items-center gap-1">
          <label className="font-rokh font-bold compact:text-base mobile-lg:text-lg fold:text-xl laptop:text-2xl mt-1">
            8/4
          </label>
          <label className="font-peyda font-bold compact:text-xxs mobile:text-xs fold:text-sm laptop:text-base">
            لیوان
          </label>
        </div>
      </div>
      <AnimatedWaveCircle />
      <div className="w-full bg-blue-200 dark:bg-darker-blue-300 border-[1.5px] border-blue-300 dark:border-dark rounded-[37px] py-1.5 flex flex-row justify-center items-center gap-2">
        <PiPlusBold
          className="text-blue-400 compact:text-2xl fold:text-3xl laptop:text-4xl"
          strokeWidth={4}
        />
        <label className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg text-blue-400">
          یک لیوان
        </label>
      </div>
    </div>
  );
};

export default memo(DailyWater);

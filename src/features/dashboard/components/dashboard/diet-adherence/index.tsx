import { memo } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import DietAdherenceCircularScore from "./diet-adherence-circular-score";

const DietAdherenceScore = () => {
  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-center gap-4
                "
    >
      <div className="w-full flex flex-row items-center justify-between">
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          امتیاز پایبندی به رژیم
        </h2>
        <div className="text-blue-400 hover:text-blue-500 active:text-blue-500 flex flex-row items-center gap-0.5 cursor-pointer">
          <h4 className="font-peyda font-bold leading-[140%] compact:text-sm fold:text-base laptop:text-lg">
            بررسی دقیق‌تر
          </h4>
          <LuArrowUpLeft
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={2.5}
          />
        </div>
      </div>
      <DietAdherenceCircularScore value={60} />
      <div className="w-full border border-blue-300 dark:border-dark text-center rounded-[42px] px-3 py-1.5">
        <h3 className="font-yekan font-extrabold leading-[135%] text-green-700 compact:text-sm mobile:text-base fold:text-lg laptop:text-xl">
          کنترل عالی قند و کربوهیدرات‌های ساده
        </h3>
      </div>
    </div>
  );
};

export default memo(DietAdherenceScore);

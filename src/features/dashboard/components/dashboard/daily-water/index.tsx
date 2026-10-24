import { memo, useState } from "react";
import { PiPlusBold } from "react-icons/pi";

import AnimatedWaveCircle from "./animated-wave-circle";
import {
  DAILY_WATER_GOAL,
  readDailyWater,
  writeDailyWater,
} from "../../../lib/daily-water.utils";

type DailyWaterProps = {
  date: string;
};

// The dashboard keys this card by date so each selection loads its own count.
const DailyWater = ({ date }: DailyWaterProps) => {
  const [glasses, setGlasses] = useState(() => readDailyWater(date));
  const complete = glasses === DAILY_WATER_GOAL;

  const addGlass = () => {
    if (complete) return;
    const next = Math.min(glasses + 1, DAILY_WATER_GOAL);
    setGlasses(next);
    writeDailyWater(date, next);
  };

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
          <span
            dir="ltr"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${glasses} از ${DAILY_WATER_GOAL} لیوان`}
            className="font-rokh font-bold leading-none tabular-nums compact:text-base mobile-lg:text-lg fold:text-xl laptop:text-2xl"
          >
            {DAILY_WATER_GOAL}/{glasses}
          </span>

          <label className="font-peyda font-bold leading-none compact:text-xxs mobile:text-xs fold:text-sm laptop:text-base">
            لیوان
          </label>
        </div>
      </div>

      <AnimatedWaveCircle progress={glasses / DAILY_WATER_GOAL} />

      <button
        type="button"
        onClick={addGlass}
        disabled={complete}
        aria-label={complete ? "هدف آب روزانه تکمیل شد" : "افزودن یک لیوان آب"}
        className="
          mt-auto w-full
          compact:min-h-8 fold:min-h-10 laptop:min-h-12
          bg-blue-200 dark:bg-darker-blue-300 hover:bg-blue-300 active:bg-blue-300 dark:hover:bg-darker-blue-400 dark:active:bg-darker-blue-400
          text-blue-400 hover:text-blue-500 active:text-blue-500
          border-[1.5px] border-blue-300 dark:border-dark
          rounded-[37px]
          flex flex-row justify-center items-center gap-2 cursor-pointer
          disabled:cursor-default disabled:bg-blue-300 disabled:text-blue-800
          dark:disabled:bg-darker-blue-100 dark:disabled:text-blue-400
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500
        "
      >
        {!complete && (
          <PiPlusBold
            aria-hidden="true"
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={4}
          />
        )}

        <span className="font-peyda font-bold leading-none whitespace-nowrap compact:text-sm fold:text-base laptop:text-lg">
          {complete ? "تکمیل شد" : "یک لیوان"}
        </span>
      </button>
    </div>
  );
};

export default memo(DailyWater);

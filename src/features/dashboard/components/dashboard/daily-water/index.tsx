import { memo, useState } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";

import AnimatedWaveCircle from "./animated-wave-circle";
import {
  DAILY_WATER_GOAL,
  DAILY_WATER_LABELS,
  readDailyWater,
  writeDailyWater,
} from "../../../lib/daily-water.utils";

type DailyWaterProps = {
  date: string;
  readOnly: boolean;
};

// The dashboard keys this card by date so each selection loads its own count.
const DailyWater = ({ date, readOnly }: DailyWaterProps) => {
  const [storedGlasses, setGlasses] = useState(() =>
    readOnly ? 0 : readDailyWater(date),
  );
  const glasses = readOnly ? 0 : storedGlasses;
  const complete = glasses === DAILY_WATER_GOAL;

  const changeGlasses = (delta: number) => {
    if (readOnly) return;
    const next = Math.min(DAILY_WATER_GOAL, Math.max(0, glasses + delta));
    if (next === glasses) return;
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

      <div
        dir="ltr"
        role="group"
        aria-label="تنظیم تعداد لیوان آب"
        className="
          mt-auto w-full
          compact:min-h-8 fold:min-h-10 laptop:min-h-12
          bg-blue-200 dark:bg-darker-blue-300
          text-blue-400
          border-[1.5px] border-blue-300 dark:border-dark
          rounded-[37px]
          grid grid-cols-[1fr_auto_1fr] items-stretch gap-1
        "
      >
        <button
          type="button"
          onClick={() => changeGlasses(-1)}
          disabled={readOnly || glasses === 0}
          aria-label="حذف یک لیوان آب"
          className="flex items-center justify-center rounded-full p-1 cursor-pointer enabled:hover:bg-blue-300 dark:enabled:hover:bg-darker-blue-400 disabled:cursor-default disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <PiMinusBold
            aria-hidden="true"
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
          />
        </button>

        <span
          dir="rtl"
          className="self-center font-peyda font-bold leading-none whitespace-nowrap tabular-nums compact:text-sm fold:text-base laptop:text-lg"
        >
          {DAILY_WATER_LABELS[glasses]}
        </span>
        <button
          type="button"
          onClick={() => changeGlasses(1)}
          disabled={readOnly || complete}
          aria-label="افزودن یک لیوان آب"
          className="flex items-center justify-center rounded-full p-1 cursor-pointer enabled:hover:bg-blue-300 dark:enabled:hover:bg-darker-blue-400 disabled:cursor-default disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <PiPlusBold
            aria-hidden="true"
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
          />
        </button>
      </div>
    </div>
  );
};

export default memo(DailyWater);

import { memo } from "react";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import type { CaloriesData } from "../../../api/types/calories.types";
import CircularDailyCaloriesProgress from "./circular-daily-calories-progress";

type DailyCaloriesProps = {
  data?: CaloriesData;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

const DailyCalories = ({ data, isLoading, error, onRetry }: DailyCaloriesProps) => {
  const consumed = data ? Math.round(data.consumed) : 0;
  const target = data ? Math.round(data.target) : 0;
  const unavailable = isLoading || Boolean(error) || !data;

  return (
    <div
      aria-busy={isLoading}
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

      <CircularDailyCaloriesProgress
        value={unavailable ? 0 : consumed}
        max={unavailable ? 0 : target}
      />

      <div
        aria-live="polite"
        className="
          relative mt-auto w-full
          compact:min-h-8 fold:min-h-10 laptop:min-h-12 pt-1
          flex flex-row justify-center items-center
        "
      >
        <div
          className={`text-orange-200 flex flex-row-reverse items-center gap-0.5 ${error ? "invisible" : ""}`}
        >
          <label className="font-rokh font-extrabold leading-none compact:text-4xl mobile:text-5xl fold:text-[28px] laptop:text-6xl">
            {unavailable ? "—" : consumed}
          </label>

          <small className="font-yekan font-normal leading-none compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
            kcal
          </small>
        </div>

        <label
          className={`font-rokh font-extrabold leading-none compact:text-base mobile:text-lg fold:text-xl laptop:text-2xl text-blue-500 dark:text-darker-blue-100 ${error ? "invisible" : ""}`}
        >
          /{unavailable ? "—" : target}
        </label>
        {isLoading && <span className="sr-only">در حال دریافت کالری</span>}
        {Boolean(error) && (
          <button
            type="button"
            onClick={onRetry}
            title={getApiErrorMessage(error)}
            className="absolute inset-0 w-full truncate text-sm font-yekan text-red-400 dark:text-red-200 cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span role="alert" className="sr-only">
              {getApiErrorMessage(error)}
            </span>
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(DailyCalories);

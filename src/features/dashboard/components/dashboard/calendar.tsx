import {
  formatPlanDate,
  formatPlanDateForApi,
  getTehranCalendarDate,
  isWithinPlan,
  type PlanDateRange,
} from "../../lib/plan-date.utils";
import { memo } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { LuCalendarDays } from "react-icons/lu";

type CalendarProps = {
  selectedDate: number;
  range: PlanDateRange;
  onSelectDate: (date: number) => void;
};

const Calendar = ({ selectedDate, range, onSelectDate }: CalendarProps) => {
  const formatted = formatPlanDate(selectedDate);
  const canGoBack = isWithinPlan(selectedDate - 1, range);
  const canGoForward = isWithinPlan(selectedDate + 1, range);
  const navigate = (offset: -1 | 1) => {
    const nextDate = selectedDate + offset;
    if (isWithinPlan(nextDate, range)) onSelectDate(nextDate);
  };
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
      <button
        type="button"
        aria-label="روز قبل"
        disabled={!canGoBack}
        onClick={() => navigate(-1)}
        className="disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
      >
        <HiOutlineChevronRight
          className="compact:text-7xl fold:text-[36px] laptop:text-8xl"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
      <div
        className="flex-1 flex flex-row justify-center items-center gap-1.5"
        aria-live="polite"
        aria-atomic="true"
        aria-label={formatted.label}
      >
        <span className="relative flex items-center focus-within:outline-2 focus-within:rounded">
          <LuCalendarDays
            className="compact:text-4xl fold:text-5xl laptop:text-6xl"
            strokeWidth={1.5}
          />
          <input
            type="date"
            aria-label="انتخاب تاریخ"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={formatPlanDateForApi(selectedDate)}
            min={formatPlanDateForApi(range.planStartDate)}
            max={formatPlanDateForApi(range.planEndDate)}
            onClick={(event) => event.currentTarget.showPicker?.()}
            onChange={(event) => {
              const value = event.currentTarget.valueAsNumber;
              if (!Number.isFinite(value)) return;
              const date = getTehranCalendarDate(new Date(value));
              if (isWithinPlan(date, range)) onSelectDate(date);
            }}
          />
        </span>
        <label className="font-peyda font-bold leading-[140%] compact:text-base fold:text-lg laptop:text-xl">
          {formatted.weekday}
        </label>
        <label className="font-rokh font-bold leading-[140%] compact:text-lg fold:text-xl laptop:text-2xl mt-1">
          {formatted.day}
        </label>
        <label className="font-peyda font-bold leading-[140%] compact:text-base fold:text-lg laptop:text-xl">
          {formatted.month}
        </label>
      </div>
      <button
        type="button"
        aria-label="روز بعد"
        disabled={!canGoForward}
        onClick={() => navigate(1)}
        className="disabled:opacity-40 disabled:cursor-not-allowed enabled:cursor-pointer"
      >
        <HiOutlineChevronLeft
          className="compact:text-7xl fold:text-[36px] laptop:text-8xl"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default memo(Calendar);

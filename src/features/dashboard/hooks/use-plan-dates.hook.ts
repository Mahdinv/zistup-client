import { useEffect, useState } from "react";
import type { DietResponse } from "../api/types/diet-response.types";
import {
  clampPlanDate,
  getDietDayForDate,
  getDietDayIndex,
  isWithinPlan,
  getPlanDateRange,
  getTehranCalendarDate,
  getWeeklyProgressDays,
} from "../lib/plan-date.utils";

const usePlanDates = (plan: DietResponse | undefined) => {
  const [today, setToday] = useState(getTehranCalendarDate);
  const [selection, setSelection] = useState<{
    planCreatedAtUtc: string;
    date: number;
  } | null>(null);

  useEffect(() => {
    const updateToday = () => setToday(getTehranCalendarDate());
    const timer = window.setInterval(updateToday, 60_000);
    window.addEventListener("focus", updateToday);
    document.addEventListener("visibilitychange", updateToday);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", updateToday);
      document.removeEventListener("visibilitychange", updateToday);
    };
  }, []);

  const range =
    plan?.days.length === 7 &&
    plan.days.every((day, index) => day.day === index + 1)
      ? getPlanDateRange(plan.createdAtUtc)
      : null;

  // Keep only user selection in state; derive API data and defaults directly.
  const selectedDate = range
    ? clampPlanDate(
        selection && selection.planCreatedAtUtc === plan?.createdAtUtc
          ? selection.date
          : today,
        range,
      )
    : null;

  const selectDate = (date: number) => {
    if (!plan || !range || !isWithinPlan(date, range)) return;
    setSelection({ planCreatedAtUtc: plan.createdAtUtc, date });
  };

  return {
    range,
    selectedDate,
    selectDate,
    activeDietDayIndex: range ? getDietDayIndex(today, range) : null,
    selectedDietDayIndex:
      range && selectedDate !== null
        ? getDietDayIndex(selectedDate, range)
        : null,
    selectedDietDay:
      plan && range && selectedDate !== null
        ? getDietDayForDate(plan, selectedDate, range)
        : null,
    today,
    weeklyDays: range ? getWeeklyProgressDays(today, range) : [],
  };
};

export default usePlanDates;

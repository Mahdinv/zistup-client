import { d2g, d2j, g2d, j2d, jalaaliMonthLength } from "jalaali-js";
import type { DietResponse } from "../api/types/diet-response.types";

export const PLAN_TIME_ZONE = "Asia/Tehran";

// Integer Julian day numbers represent calendar dates, not instants or durations.
export type PlanDateRange = {
  planStartDate: number;
  planEndDate: number;
};

export type WeeklyProgressDay = {
  date: number;
  day: string;
  label: string;
  dietDayIndex: number | null;
  status: "completed" | "in-progress" | "pending";
};

const tehranDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PLAN_TIME_ZONE,
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR", {
  calendar: "persian",
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const getTehranCalendarDate = (instant: Date = new Date()): number => {
  const parts = tehranDateFormatter.formatToParts(instant);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((value) => value.type === type)?.value);
  return g2d(part("year"), part("month"), part("day"));
};

// UTC is only a neutral container for formatting an already-localized calendar date.
const toDateForFormatting = (date: number): Date => {
  const { gy, gm, gd } = d2g(date);
  const result = new Date(0);
  result.setUTCFullYear(gy, gm - 1, gd);
  result.setUTCHours(12, 0, 0, 0);
  return result;
};

export const formatPlanDateForApi = (date: number): string => {
  const { gy, gm, gd } = d2g(date);
  return [
    String(gy).padStart(4, "0"),
    String(gm).padStart(2, "0"),
    String(gd).padStart(2, "0"),
  ].join("-");
};

export const formatPlanDate = (date: number) => {
  const parts = persianDateFormatter.formatToParts(toDateForFormatting(date));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((value) => value.type === type)?.value ?? "";
  return {
    weekday: part("weekday"),
    day: part("day"),
    month: part("month"),
    label: persianDateFormatter.format(toDateForFormatting(date)),
  };
};

export const getPlanDateRange = (
  createdAtUtc: string,
): PlanDateRange | null => {
  // The API omits the zone in its SQL timestamp; explicitly interpret it as UTC.
  const normalized = createdAtUtc.trim().replace(" ", "T");
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z?$/.test(normalized)
  ) {
    return null;
  }
  const instant = new Date(
    normalized.endsWith("Z") ? normalized : normalized + "Z",
  );
  if (
    !Number.isFinite(instant.getTime()) ||
    instant.toISOString().slice(0, 19) !== normalized.slice(0, 19)
  ) {
    return null;
  }

  try {
    const planStartDate = getTehranCalendarDate(instant);
    const { jy, jm, jd } = d2j(planStartDate);
    const nextYear = jm === 12 ? jy + 1 : jy;
    const nextMonth = jm === 12 ? 1 : jm + 1;
    // Clamp only when the same day does not exist in the next Jalali month.
    const nextDay = Math.min(jd, jalaaliMonthLength(nextYear, nextMonth));
    return { planStartDate, planEndDate: j2d(nextYear, nextMonth, nextDay) };
  } catch {
    return null;
  }
};

export const isWithinPlan = (date: number, range: PlanDateRange): boolean =>
  Number.isInteger(date) &&
  date >= range.planStartDate &&
  date <= range.planEndDate;

export const clampPlanDate = (date: number, range: PlanDateRange): number =>
  Math.min(range.planEndDate, Math.max(range.planStartDate, date));

export const getDietDayIndex = (
  date: number,
  range: PlanDateRange,
): number | null =>
  isWithinPlan(date, range) ? (date - range.planStartDate) % 7 : null;

export const getDietDayForDate = (
  plan: DietResponse,
  date: number,
  range: PlanDateRange,
) => {
  const index = getDietDayIndex(date, range);
  return index === null ? null : (plan.days[index] ?? null);
};

export const getWeeklyProgressDays = (
  today: number,
  range: PlanDateRange,
): WeeklyProgressDay[] => {
  const weekday = toDateForFormatting(today).getUTCDay();
  const weekStart = today - ((weekday + 1) % 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = weekStart + index;
    const formatted = formatPlanDate(date);
    const dietDayIndex = getDietDayIndex(date, range);
    return {
      date,
      day: formatted.weekday[0],
      label: formatted.label,
      dietDayIndex,
      // Completed denotes elapsed plan dates, not logged meal adherence.
      status:
        dietDayIndex === null
          ? "pending"
          : date === today
            ? "in-progress"
            : date < today
              ? "completed"
              : "pending",
    };
  });
};

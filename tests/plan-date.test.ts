import assert from "node:assert/strict";
import { test } from "node:test";
import { d2j, j2d, toGregorian } from "jalaali-js";
import {
  clampPlanDate,
  formatPlanDate,
  formatPlanDateForApi,
  getDietDayForDate,
  getDietDayIndex,
  getPlanDateRange,
  getTehranCalendarDate,
  getWeeklyProgressDays,
  isWithinPlan,
} from "../src/features/dashboard/lib/plan-date.utils.ts";
import type { DietResponse } from "../src/features/dashboard/api/types/diet-response.types.ts";

type JalaliTuple = [number, number, number];
const utcTimestamp = ([year, month, day]: JalaliTuple) => {
  const { gy, gm, gd } = toGregorian(year, month, day);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")} 08:00:00`;
};

const cases: { name: string; start: JalaliTuple; end: JalaliTuple }[] = [
  { name: "same day next month", start: [1405, 7, 20], end: [1405, 8, 20] },
  { name: "31-day to 31-day month", start: [1405, 5, 31], end: [1405, 6, 31] },
  {
    name: "31-day to 30-day month clamps to last day",
    start: [1405, 6, 31],
    end: [1405, 7, 30],
  },
  {
    name: "normal Esfand clamps to 29",
    start: [1404, 11, 30],
    end: [1404, 12, 29],
  },
  {
    name: "leap Esfand preserves day 30",
    start: [1403, 11, 30],
    end: [1403, 12, 30],
  },
  {
    name: "normal Esfand crosses year",
    start: [1404, 12, 29],
    end: [1405, 1, 29],
  },
  {
    name: "leap Esfand crosses year",
    start: [1403, 12, 30],
    end: [1404, 1, 30],
  },
];

for (const { name, start, end } of cases) {
  test(name, () => {
    const range = getPlanDateRange(utcTimestamp(start));
    assert.ok(range);
    assert.equal(range.planStartDate, j2d(...start));
    assert.equal(range.planEndDate, j2d(...end));
    assert.equal(isWithinPlan(range.planStartDate, range), true);
    assert.equal(isWithinPlan(range.planEndDate, range), true);
    assert.equal(isWithinPlan(range.planStartDate - 1, range), false);
    assert.equal(isWithinPlan(range.planEndDate + 1, range), false);
    assert.equal(getDietDayIndex(range.planStartDate, range), 0);
    assert.equal(
      getDietDayIndex(range.planEndDate, range),
      (range.planEndDate - range.planStartDate) % 7,
    );
  });
}

test("UTC timestamp is localized to Tehran before deriving the date", () => {
  const beforeMidnight = getPlanDateRange("2026-10-11 20:29:59");
  const afterMidnight = getPlanDateRange("2026-10-11 20:30:00");
  assert.ok(beforeMidnight && afterMidnight);
  assert.equal(afterMidnight.planStartDate, beforeMidnight.planStartDate + 1);
  assert.deepEqual(d2j(afterMidnight.planStartDate), {
    jy: 1405,
    jm: 7,
    jd: 20,
  });
  assert.equal(
    getTehranCalendarDate(new Date("2026-10-11T20:30:00Z")),
    afterMidnight.planStartDate,
  );
  assert.deepEqual(getPlanDateRange("2026-10-11T20:30:00.000Z"), afterMidnight);
});

test("supplied example timestamp preserves its Tehran calendar date", () => {
  const range = getPlanDateRange("2026-10-02 20:11:08");
  assert.ok(range);
  assert.deepEqual(d2j(range.planStartDate), { jy: 1405, jm: 7, jd: 10 });
  assert.deepEqual(d2j(range.planEndDate), { jy: 1405, jm: 8, jd: 10 });
});

test("Persian display is generated from the actual calendar date", () => {
  const formatted = formatPlanDate(j2d(1405, 7, 20));
  assert.equal(formatted.day, "۲۰");
  assert.equal(formatted.month, "مهر");
  assert.equal(formatted.weekday, "دوشنبه");
});

test("Monday plan day 1 repeats at 7, 14, 21 and 28 days", () => {
  const range = getPlanDateRange("2026-10-12 08:00:00");
  assert.ok(range);
  for (const elapsed of [0, 7, 14, 21, 28]) {
    const date: number = range.planStartDate + elapsed;
    assert.equal(getDietDayIndex(date, range), 0);
    const week = getWeeklyProgressDays(date, range);
    assert.deepEqual(
      week.map((day) => day.day),
      ["ش", "ی", "د", "س", "چ", "پ", "ج"],
    );
    const active = week.filter((day) => day.status === "in-progress");
    assert.equal(active.length, 1);
    assert.equal(active[0].date, date);
    assert.equal(active[0].dietDayIndex, 0);
    assert.equal(active[0].day, "د");
  }
});

test("every valid selected date retrieves the repeating diet entry", () => {
  const range = getPlanDateRange("2026-10-12 08:00:00");
  assert.ok(range);
  const plan: DietResponse = {
    createdAtUtc: "2026-10-12 08:00:00",
    diet: { key: "test", title: "test" },
    shopping: { basis: "test", groups: [] },
    days: Array.from({ length: 7 }, (_, index) => ({
      day: index + 1,
      title: `Day ${index + 1}`,
      nutrition: { caloriesKcal: 0, proteinG: 0, carbohydrateG: 0, fiberG: 0 },
      meals: [],
    })),
  };
  for (let date = range.planStartDate; date <= range.planEndDate; date++) {
    assert.equal(
      getDietDayForDate(plan, date, range),
      plan.days[(date - range.planStartDate) % 7],
    );
  }
  assert.equal(getDietDayForDate(plan, range.planStartDate - 1, range), null);
  assert.equal(getDietDayForDate(plan, range.planEndDate + 1, range), null);
});

test("initial selection clamps outside the range and preserves today inside", () => {
  const range = {
    planStartDate: j2d(1405, 7, 20),
    planEndDate: j2d(1405, 8, 20),
  };
  for (const date of [
    range.planStartDate,
    range.planStartDate + 10,
    range.planEndDate,
  ]) {
    assert.equal(clampPlanDate(date, range), date);
    assert.equal(
      getWeeklyProgressDays(date, range).filter(
        (day) => day.status === "in-progress",
      ).length,
      1,
    );
  }
  assert.equal(
    clampPlanDate(range.planStartDate - 1, range),
    range.planStartDate,
  );
  assert.equal(clampPlanDate(range.planEndDate + 1, range), range.planEndDate);
  for (const date of [range.planStartDate - 1, range.planEndDate + 1]) {
    assert.equal(getDietDayIndex(date, range), null);
    assert.equal(
      getWeeklyProgressDays(date, range).some(
        (day) => day.status === "in-progress",
      ),
      false,
    );
  }
  assert.equal(isWithinPlan(range.planStartDate + 0.5, range), false);
});

test("historical Tehran DST does not change calendar-day differences", () => {
  const first = getTehranCalendarDate(new Date("2021-03-21T08:00:00Z"));
  const second = getTehranCalendarDate(new Date("2021-03-22T08:00:00Z"));
  assert.equal(second - first, 1);
  const range = getPlanDateRange("2021-03-21 08:00:00");
  assert.ok(range);
  assert.equal(getDietDayIndex(second, range), 1);
});

test("malformed or impossible creation dates are rejected", () => {
  for (const value of [
    "",
    "invalid",
    "2026-02-30 00:00:00",
    "2026-13-01 00:00:00",
    "2026-10-02 24:00:00",
    "2026-10-02",
    "2026-10-02T20:11:08+03:30",
  ]) {
    assert.equal(getPlanDateRange(value), null);
  }
});

test("API date uses the selected Gregorian calendar day with zero padding", () => {
  assert.equal(
    formatPlanDateForApi(
      getTehranCalendarDate(new Date("2026-01-02T12:00:00Z")),
    ),
    "2026-01-02",
  );
  assert.equal(
    formatPlanDateForApi(
      getTehranCalendarDate(new Date("2026-10-22T21:00:00Z")),
    ),
    "2026-10-23",
  );
});

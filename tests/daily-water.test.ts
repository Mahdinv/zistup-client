import assert from "node:assert/strict";
import { test } from "node:test";
import { g2d } from "jalaali-js";
// Node does not expose browser storage unless explicitly enabled.
Object.defineProperty(globalThis, "localStorage", {
  value: undefined,
  writable: true,
  configurable: true,
});
import {
  readDailyWater,
  writeDailyWater,
} from "../src/features/dashboard/lib/daily-water.utils.ts";
import {
  formatPlanDateForApi,
  getTehranCalendarDate,
} from "../src/features/dashboard/lib/plan-date.utils.ts";

test("water persists independently for each dashboard calendar date", (t) => {
  const entries = new Map<string, string>();
  t.mock.property(globalThis, "localStorage", {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
  });
  const today = g2d(2026, 10, 24);
  const date = formatPlanDateForApi(today);
  const previous = formatPlanDateForApi(today - 1);
  assert.equal(readDailyWater(date), 0);
  writeDailyWater(date, 8);
  writeDailyWater(previous, 3);
  assert.equal(entries.get("zistup:daily-water:v1:2026-10-24"), "8");
  assert.equal(readDailyWater(date), 8);
  assert.equal(readDailyWater(previous), 3);
  writeDailyWater(previous, 4);
  assert.equal(readDailyWater(date), 8);
  assert.equal(readDailyWater(previous), 4);
  assert.equal(
    formatPlanDateForApi(
      getTehranCalendarDate(new Date("2026-10-23T21:00:00Z")),
    ),
    date,
  );
});

test("water storage rejects malformed values and bounds stored counts", (t) => {
  let stored: string | null = null;
  t.mock.property(globalThis, "localStorage", { getItem: () => stored });
  for (const value of [
    null,
    "broken",
    '"4"',
    "null",
    "{}",
    "[]",
    "true",
    "2.5",
    "1e400",
  ]) {
    stored = value;
    assert.equal(readDailyWater("2026-10-24"), 0);
  }
  stored = "-2";
  assert.equal(readDailyWater("2026-10-24"), 0);
  stored = "99";
  assert.equal(readDailyWater("2026-10-24"), 8);
});

test("blocked reads and failed writes do not interrupt the card", (t) => {
  t.mock.property(globalThis, "localStorage", {
    getItem: () => {
      throw new Error("Storage blocked");
    },
    setItem: () => {
      throw new Error("Storage full");
    },
  });
  assert.equal(readDailyWater("2026-10-24"), 0);
  assert.doesNotThrow(() => writeDailyWater("2026-10-24", 1));
});

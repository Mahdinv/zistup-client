import assert from "node:assert/strict";
import { test } from "node:test";
import type { DietAdherenceData } from "../src/features/dashboard/api/types/diet-adherence.types.ts";
import { getDietAdherenceDisplay } from "../src/features/dashboard/lib/diet-adherence.utils.ts";
import { dietAdherenceQueryKeys } from "../src/features/dashboard/constants/diet-adherence-query.constants.ts";

const logged: DietAdherenceData = {
  date: "2026-10-24",
  status: "in_progress",
  score_display: 75,
  score_max: 100,
  has_logs: true,
  message_code: "مصرف گروه‌های غذایی امروز در حال تکمیل است.",
};

test("either no-logs signal hides the provisional score while preserving the API message", () => {
  for (const data of [
    { ...logged, status: "no_logs", has_logs: false, score_display: 17 },
    { ...logged, status: "no_logs", score_display: 17 },
    { ...logged, has_logs: false, score_display: 17 },
  ]) {
    const display = getDietAdherenceDisplay(data);
    assert.equal(display.value, null);
    assert.equal(display.progress, 0);
    assert.equal(display.tone, "neutral");
    assert.equal(display.message, data.message_code);
    assert.equal(display.max, 100);
  }
});

test("five score ranges use normalized boundaries from red through green", () => {
  for (const [score, tone] of [
    [0, "low"],
    [19, "low"],
    [20, "medium"],
    [30, "medium"],
    [39, "medium"],
    [40, "yellow-green"],
    [55, "yellow-green"],
    [59, "yellow-green"],
    [60, "light-green"],
    [75, "light-green"],
    [79, "light-green"],
    [80, "high"],
    [100, "high"],
  ] as const) {
    const display = getDietAdherenceDisplay({
      ...logged,
      score_display: score,
    });
    assert.equal(display.value, score);
    assert.equal(display.progress, score / 100);
    assert.equal(display.tone, tone);
  }
  assert.equal(
    getDietAdherenceDisplay({ ...logged, score_display: 15, score_max: 20 })
      .tone,
    "light-green",
  );
});

test("API messages are displayed directly without mapping or replacement", () => {
  for (const message_code of [
    logged.message_code,
    "هنوز وعده‌ای ثبت نکردی",
    "",
  ]) {
    assert.equal(
      getDietAdherenceDisplay({ ...logged, message_code }).message,
      message_code,
    );
  }
  assert.equal(getDietAdherenceDisplay().message, "");
});

test("unavailable and invalid scores cannot produce invalid SVG progress", () => {
  assert.equal(getDietAdherenceDisplay().value, null);
  for (const score_display of [null, NaN, Infinity]) {
    assert.equal(
      getDietAdherenceDisplay({ ...logged, score_display }).value,
      null,
    );
  }
  assert.equal(
    getDietAdherenceDisplay({ ...logged, score_display: -1 }).value,
    0,
  );
  assert.equal(
    getDietAdherenceDisplay({ ...logged, score_display: 200 }).value,
    100,
  );
  assert.equal(getDietAdherenceDisplay({ ...logged, score_max: 0 }).max, 100);
});

test("selected dates have separate cache entries under one invalidation prefix", () => {
  assert.notDeepEqual(
    dietAdherenceQueryKeys.daily("2026-10-24"),
    dietAdherenceQueryKeys.daily("2026-10-23"),
  );
  assert.deepEqual(
    dietAdherenceQueryKeys.daily("2026-10-24").slice(0, -1),
    dietAdherenceQueryKeys.all,
  );
});

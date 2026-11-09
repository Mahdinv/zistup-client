import assert from "node:assert/strict";
import { test } from "node:test";
import type { RadarData } from "../src/features/dashboard/api/types/radar.types.ts";
import { getRadarDisplayAxes } from "../src/features/dashboard/lib/radar.utils.ts";

const sample: RadarData = {
  axis_order: ["health", "environment", "cost", "accessibility"],
  score_values: [6.708028, 82.146289, 82.321202, 91.811228],
};

test("v2 scores map to axis_order by index without changing precision", () => {
  assert.deepEqual(getRadarDisplayAxes(sample), [
    { key: "health", score: 6.708028 },
    { key: "environment", score: 82.146289 },
    { key: "cost", score: 82.321202 },
    { key: "accessibility", score: 91.811228 },
  ]);
  const reordered: RadarData = {
    axis_order: ["cost", "health", "accessibility", "environment"],
    score_values: [25, 50, 75, 100],
  };
  assert.deepEqual(getRadarDisplayAxes(reordered), [
    { key: "cost", score: 25 },
    { key: "health", score: 50 },
    { key: "accessibility", score: 75 },
    { key: "environment", score: 100 },
  ]);
});

test("null scores remain gaps while zero remains a valid center point", () => {
  const data = { ...sample, score_values: [null, 0, 75, null] };
  const before = structuredClone(data);
  assert.deepEqual(
    getRadarDisplayAxes(data).map(({ score }) => score),
    [null, 0, 75, null],
  );
  assert.deepEqual(data, before);
});

test("missing data preserves the four axes with gaps", () => {
  for (const data of [undefined, { axis_order: [], score_values: [] }]) {
    const axes = getRadarDisplayAxes(data);
    assert.deepEqual(
      axes.map(({ key }) => key),
      sample.axis_order,
    );
    assert.deepEqual(
      axes.map(({ score }) => score),
      [null, null, null, null],
    );
  }
});

test("missing and nonfinite scores never become plotted zeros", () => {
  const axes = getRadarDisplayAxes({
    ...sample,
    score_values: [NaN, Infinity, 0],
  });
  assert.deepEqual(
    axes.map(({ score }) => score),
    [null, null, 0, null],
  );
});

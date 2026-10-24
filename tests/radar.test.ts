import assert from "node:assert/strict";
import { test } from "node:test";
import type {
  RadarAxis,
  RadarData,
} from "../src/features/dashboard/api/types/radar.types.ts";
import { getRadarDisplayAxes } from "../src/features/dashboard/lib/radar.utils.ts";

const available: RadarAxis = {
  actual: 0.759294874016737,
  target: 0.641369,
  value: 118.38658775474602,
  plot_value: 118.38658775474602,
  overflow: false,
  status: "ok",
};

const sample: RadarData = {
  axis_order: ["health", "environment", "cost", "accessibility"],
  axes: {
    health: {
      actual: 0,
      target: 100,
      value: 0,
      plot_value: 0,
      overflow: false,
      status: "unavailable",
    },
    environment: {
      actual: 0,
      target: 0.7339,
      value: 0,
      plot_value: 0,
      overflow: false,
      status: "unavailable",
    },
    cost: {
      actual: 470.2726895758175,
      target: 742.573,
      value: 63.33016276861905,
      plot_value: 63.33016276861905,
      overflow: false,
      status: "ok",
    },
    accessibility: available,
  },
};

test("sample unavailable zeros become gaps; available values retain their units and precision", () => {
  const axes = getRadarDisplayAxes(sample);
  assert.deepEqual(
    axes.map((axis) => axis.plotValue),
    [null, null, 63.33016276861905, 118.38658775474602],
  );
  assert.equal(axes[0].actual, null);
  assert.equal(axes[0].value, null);
  assert.equal(axes[0].target, 100);
  assert.equal(axes[3].actual, available.actual);
  assert.equal(axes[3].target, available.target);
});

test("axis ordering follows the response rather than object insertion order", () => {
  const axis_order: RadarData["axis_order"] = [
    "cost",
    "accessibility",
    "health",
    "environment",
  ];
  assert.deepEqual(
    getRadarDisplayAxes({ ...sample, axis_order }).map((axis) => axis.key),
    axis_order,
  );
});

test("valid health scores, including zero, pass through without inversion", () => {
  for (const value of [0, 25, 50, 100]) {
    const health = {
      ...available,
      actual: value,
      target: 100,
      value,
      plot_value: value,
    };
    const axes = getRadarDisplayAxes({
      ...sample,
      axes: { ...sample.axes, health },
    });
    assert.equal(axes[0].plotValue, value);
    assert.equal(axes[0].value, value);
  }
});

test("overflow preserves the raw percentage and uses the supplied capped plot value", () => {
  const accessibility = {
    ...available,
    value: 247.8,
    plot_value: 200,
    overflow: true,
  };
  const axis = getRadarDisplayAxes({
    ...sample,
    axes: { ...sample.axes, accessibility },
  })[3];
  assert.equal(axis.plotValue, 200);
  assert.equal(axis.value, 247.8);
  assert.equal(axis.overflow, true);
});

test("null or nonfinite metrics never become valid zero points", () => {
  for (const missing of [null, undefined, NaN, Infinity]) {
    const accessibility = { ...available, plot_value: missing };
    const axis = getRadarDisplayAxes({
      ...sample,
      axes: { ...sample.axes, accessibility },
    })[3];
    assert.equal(axis.plotValue, null);
    assert.equal(axis.value, null);
  }
});

test("zero is preserved on every axis so the polygon can connect through the center", () => {
  const data = structuredClone(sample);
  for (const key of data.axis_order) {
    data.axes[key] = { ...available, actual: 0, value: 0, plot_value: 0 };
    const axes = getRadarDisplayAxes(data);
    assert.equal(axes.find((axis) => axis.key === key)?.plotValue, 0);
  }
  assert.deepEqual(
    getRadarDisplayAxes(data).map((axis) => axis.plotValue),
    [0, 0, 0, 0],
  );
});

test("missing original-unit metrics do not hide an available backend plotting value", () => {
  const accessibility = {
    ...available,
    actual: null,
    target: null,
    value: null,
    plot_value: 0,
  };
  const axes = getRadarDisplayAxes({
    ...sample,
    axes: { ...sample.axes, accessibility },
  });
  assert.equal(axes[3].plotValue, 0);
  assert.equal(axes[3].value, null);
});

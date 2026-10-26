import type { RadarAxisKey, RadarData } from "../api/types/radar.types";

const defaultAxisOrder: RadarAxisKey[] = [
  "health",
  "environment",
  "cost",
  "accessibility",
];

export function getRadarDisplayAxes(data?: RadarData) {
  const order = data?.axis_order?.length ? data.axis_order : defaultAxisOrder;
  return order.map((key) => {
    const axis = data?.axes?.[key];
    if (!axis)
      return {
        key,
        actual: 0,
        target: 0,
        value: 0,
        plotValue: 0,
        overflow: false,
      };
    const available =
      axis.status !== "unavailable" &&
      // Only the plotting value controls geometry. Zero is a valid center point.
      typeof axis.plot_value === "number" &&
      Number.isFinite(axis.plot_value);

    return {
      key,
      actual: available && Number.isFinite(axis.actual) ? (axis.actual ?? 0) : 0,
      target: Number.isFinite(axis.target) ? (axis.target ?? 0) : 0,
      value: available && Number.isFinite(axis.value) ? (axis.value ?? 0) : 0,
      // Health is already an adherence score; never invert or recalculate it.
      // Missing/unavailable values use the center as a display-only fallback.
      plotValue: available ? axis.plot_value : 0,
      overflow: available && axis.overflow,
    };
  });
}

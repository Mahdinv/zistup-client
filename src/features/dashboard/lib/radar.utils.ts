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
        actual: null,
        target: null,
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
      actual: available ? axis.actual : null,
      target: Number.isFinite(axis.target) ? axis.target : null,
      value: available && Number.isFinite(axis.value) ? axis.value : null,
      // Health is already an adherence score; never invert or recalculate it.
      plotValue: available ? axis.plot_value : null,
      overflow: available && axis.overflow,
    };
  });
}

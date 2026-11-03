import type { RadarAxisKey, RadarData } from "../api/types/radar.types";

const defaultAxisOrder: RadarAxisKey[] = [
  "health",
  "environment",
  "cost",
  "accessibility",
];

const radarRingValues = [0, 25, 50, 100, 200] as const;

// Convert API percentages to equally spaced ring positions (0–4).
export function getRadarRadius(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;

  for (let ring = 1; ring < radarRingValues.length; ring++) {
    const start = radarRingValues[ring - 1];
    const end = radarRingValues[ring];
    if (value <= end) return ring - 1 + (value - start) / (end - start);
  }

  return radarRingValues.length - 1;
}

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

import type { RadarAxisKey, RadarData } from "../api/types/radar.types";

const defaultAxisOrder: RadarAxisKey[] = [
  "health",
  "environment",
  "cost",
  "accessibility",
];

export function getRadarDisplayAxes(data?: RadarData) {
  const order = data?.axis_order?.length ? data.axis_order : defaultAxisOrder;
  return order.map((key, index) => {
    const score = data?.score_values?.[index];
    return {
      key,
      score: typeof score === "number" && Number.isFinite(score) ? score : null,
    };
  });
}

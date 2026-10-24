import type { DietAdherenceData } from "../api/types/diet-adherence.types";

export type AdherenceTone =
  "neutral" | "low" | "medium" | "yellow-green" | "light-green" | "high";

export const adherenceScoreColors: Record<AdherenceTone, string> = {
  neutral: "var(--color-gray-200)",
  low: "var(--color-red-200)",
  medium: "var(--color-yellow-300)",
  "yellow-green": "#C7EC75",
  "light-green": "var(--color-green-300)",
  high: "var(--color-green-400)",
};

export function getDietAdherenceDisplay(data?: DietAdherenceData) {
  const max =
    data && Number.isFinite(data.score_max) && data.score_max > 0
      ? data.score_max
      : 100;
  const noLogs = data?.status === "no_logs" || data?.has_logs === false;
  const value =
    data &&
    !noLogs &&
    Number.isFinite(data.score_display) &&
    data.score_display !== null
      ? Math.min(max, Math.max(0, data.score_display))
      : null;
  const progress = value === null ? 0 : value / max;
  const tone: AdherenceTone =
    value === null
      ? "neutral"
      : progress < 0.2
        ? "low"
        : progress < 0.4
          ? "medium"
          : progress < 0.6
            ? "yellow-green"
            : progress < 0.8
              ? "light-green"
              : "high";

  return {
    value,
    max,
    progress,
    tone,
    message: data?.message_code ?? "",
  };
}

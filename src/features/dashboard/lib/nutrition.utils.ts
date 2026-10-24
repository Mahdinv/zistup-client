import type { Nutrient } from "../api/types/nutrition.types";

const numberFormat = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 6,
});

export function getNutrientComparison(nutrient: Nutrient) {
  const consumed = nutrient.status === "no_data" ? null : nutrient.consumed;
  const current =
    consumed !== null && Number.isFinite(consumed) ? consumed : null;
  const target =
    nutrient.target !== null && Number.isFinite(nutrient.target)
      ? nutrient.target
      : null;
  const magnitude = Math.max(Math.abs(current ?? 0), Math.abs(target ?? 0));
  // Normalize the pair together, preserving its ratio without flattening targets.
  // Divide first to avoid overflowing when adding very large values.
  const scale = magnitude || 1;
  const total =
    Math.abs((current ?? 0) / scale) + Math.abs((target ?? 0) / scale) || 1;
  const plot = (value: number | null) => ((value ?? 0) / scale / total) * 100;
  const unit =
    nutrient.unit === "g"
      ? magnitude <= 1e-5
        ? "µg"
        : magnitude >= 1e-4 && magnitude <= 1e-2
          ? "mg"
          : "g"
      : nutrient.unit;

  return {
    current: plot(current),
    target: plot(target),
    currentLabel: formatNutrientAmount(current, nutrient.unit, unit),
    targetLabel: formatNutrientAmount(target, nutrient.unit, unit),
  };
}

function formatNutrientAmount(
  value: number | null,
  unit: string,
  displayUnit = unit,
): string {
  if (value === null || !Number.isFinite(value)) return "داده‌ای موجود نیست";

  const factor =
    unit === "g"
      ? displayUnit === "µg"
        ? 1e6
        : displayUnit === "mg"
          ? 1e3
          : 1
      : 1;
  return `${numberFormat.format(value * factor)} ${displayUnit}`;
}

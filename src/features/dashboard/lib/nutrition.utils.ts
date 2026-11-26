import type { Nutrient } from "../api/types/nutrition.types";

const numberFormat = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 1,
});

const integerFormat = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
});

// These API-key overrides always divide raw values by 1000, regardless of unit.
const dividedDisplayUnits: Readonly<Partial<Record<string, "g" | "mg">>> = {
  vitamin_c: "g",
  calcium: "g",
  iron: "g",
  potassium: "g",
  phosphorus: "g",
  choline: "g",
  magnesium: "g",
  sodium: "g",
  folate: "mg",
};

const nutrientDisplayUnits: Readonly<Partial<Record<string, "mg" | "µg">>> = {
  zinc: "mg",
  copper: "mg",
  thiamin: "mg",
  riboflavin: "mg",
  niacin: "mg",
  vitamin_b6: "mg",
  manganese: "mg",
  vitamin_e: "mg",
  vitamin_a: "µg",
  vitamin_b12: "µg",
  selenium: "µg",
  vitamin_d: "µg",
  vitamin_k: "µg",
};

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
  // Convert only display amounts; raw values still drive chart normalization.
  const unit =
    nutrient.unit === "g"
      ? (nutrientDisplayUnits[nutrient.key] ?? nutrient.unit)
      : nutrient.unit;

  return {
    current: plot(current),
    target: plot(target),
    currentLabel: formatNutrientAmount(current, nutrient.key, nutrient.unit, unit),
    targetLabel: formatNutrientAmount(target, nutrient.key, nutrient.unit, unit),
  };
}

function formatNutrientAmount(
  value: number | null,
  key: string,
  unit: string,
  displayUnit = unit,
): string {
  if (value === null || !Number.isFinite(value)) return "داده‌ای موجود نیست";

  const dividedUnit = dividedDisplayUnits[key];
  if (dividedUnit) {
    return `${numberFormat.format(value / 1000)} ${dividedUnit}`;
  }

  const factor =
    unit === "g"
      ? displayUnit === "µg"
        ? 1e6
        : displayUnit === "mg"
          ? 1e3
          : 1
      : 1;
  const formatter = key === "calories" ? integerFormat : numberFormat;
  return `${formatter.format(value * factor)} ${displayUnit}`;
}

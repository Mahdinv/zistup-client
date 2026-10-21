import { DEFAULT_UNITS } from "../../constants/quick-add-meal.constants.ts";
import type { Food, QuantityUnit } from "../../api/types/quick-add-meal.types";
export function getGeneralUnits(food: Food): QuantityUnit[] {
  const labels = new Set<string>();
  return [...DEFAULT_UNITS, ...food.generalUnits].filter((unit) => {
    if (labels.has(unit.label)) return false;
    labels.add(unit.label);
    return true;
  });
}

import { DEFAULT_UNITS } from "../../constants/quick-add-meal.constants.ts";
import { INGREDIENT_UNITS } from "./ingredient-grams.ts";
import type { Food, QuantityUnit } from "../../api/types/quick-add-meal.types";
export function getGeneralUnits(food: Food): QuantityUnit[] {
  const labels = new Set<string>();
  const ids = new Set<string>();
  const staticUnits = food.type === "base_food" ? INGREDIENT_UNITS : DEFAULT_UNITS;
  return [...staticUnits, ...food.generalUnits].filter((unit) => {
    if (ids.has(unit.id) || labels.has(unit.label) || unit.label === "واحد نامشخص") return false;
    ids.add(unit.id);
    labels.add(unit.label);
    return true;
  });
}

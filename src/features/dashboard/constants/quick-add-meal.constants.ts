import { formatServingUnit, ServingUnit } from "../api/types/serving-unit.ts";
import type { MealId, QuantityUnit } from "../api/types/quick-add-meal.types";

export const MEALS: { id: MealId; title: string; image: string }[] = [
  { id: "lunch", title: "ناهار", image: "/pwa/add-meal/lunch.webp" },
  { id: "breakfast", title: "صبحانه", image: "/pwa/add-meal/breakfast.webp" },
  { id: "snack", title: "میان وعده", image: "/pwa/add-meal/snack.webp" },
  { id: "dinner", title: "شام", image: "/pwa/add-meal/dinner.webp" },
];
export const DEFAULT_UNITS: QuantityUnit[] = [
  { id: "palm", label: "کف دست" },
  { id: ServingUnit.Bite, label: formatServingUnit(ServingUnit.Bite) },
  { id: ServingUnit.Spoon, label: formatServingUnit(ServingUnit.Spoon) },
  { id: "gram", label: "گرم" },
];

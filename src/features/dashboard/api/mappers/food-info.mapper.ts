import type {
  FoodInfoResponse,
  FoodIngredient,
} from "../types/food-info.types";
import { formatServingUnit } from "../types/serving-unit.ts";
import type { Food, FoodPart } from "../types/quick-add-meal.types";
import { DEFAULT_UNITS } from "../../constants/quick-add-meal.constants.ts";
import { INGREDIENT_UNITS } from "../../lib/quick-add-meal/ingredient-grams.ts";
function mapIngredient(ingredient: FoodIngredient): FoodPart {
  return {
    id: String(ingredient.ingredient_id),
    title: ingredient.name,
    kcal: ingredient.nutrition.calories_kcal,
    initialAmount: ingredient.grams,
  };
}
export function mapFoodInfo({ data }: FoodInfoResponse): Food {
  const serverUnit = data.serving_unit.trim();
  const label = formatServingUnit(serverUnit);
  const staticUnits = data.type === "base_food" ? INGREDIENT_UNITS : DEFAULT_UNITS;
  const staticUnit = staticUnits.find(
    (unit) =>
      unit.id === serverUnit || unit.label === serverUnit || unit.label === label,
  );
  const servingUnit =
    staticUnit ??
    (label !== "واحد نامشخص" ? { id: serverUnit, label } :
      data.type === "base_food" && serverUnit && !["unknown", "واحد نامشخص"].includes(serverUnit)
        ? { id: serverUnit, label: serverUnit } : undefined);
  return {
    id: String(data.food_id),
    type: data.type,
    title: data.name,
    nutrition: {
      kcal: data.nutrition.calories_kcal,
      protein: data.nutrition.protein_g,
      carbohydrates: data.nutrition.carbohydrate_g,
      fiber: data.nutrition.fiber_g,
      greenhouseGas: data.nutrition.ghg_kg_co2eq ?? null,
      environmentalImpact: data.nutrition.ef_single_score_mpt ?? null,
      water: data.nutrition.water_l ?? null,
    },
    defaultUnitId: servingUnit?.id ?? "bite",
    servingWeightGrams: data.serving_weight_g,
    amountGrams: data.amount_g,
    generalUnits: servingUnit ? [servingUnit] : [],
    parts: data.ingredients.map(mapIngredient),
  };
}

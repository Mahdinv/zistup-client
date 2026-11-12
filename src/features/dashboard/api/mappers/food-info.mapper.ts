import type {
  FoodInfoResponse,
  FoodIngredient,
  FoodNutrition,
} from "../types/food-info.types";
import { formatServingUnit } from "../types/serving-unit.ts";
import type { Food, FoodPart, Nutrition } from "../types/quick-add-meal.types";
import { DEFAULT_UNITS } from "../../constants/quick-add-meal.constants.ts";
import { INGREDIENT_UNITS } from "../../lib/quick-add-meal/ingredient-grams.ts";
function mapNutrition(nutrition: FoodNutrition): Nutrition {
  return {
    kcal: nutrition.calories_kcal ?? null,
    protein: nutrition.protein_g ?? null,
    carbohydrates: nutrition.carbohydrate_g ?? null,
    fiber: nutrition.fiber_g ?? null,
    greenhouseGas: nutrition.ghg_kg_co2eq ?? null,
    environmentalImpact: nutrition.ef_single_score_mpt ?? null,
    water: nutrition.water_l ?? null,
  };
}
function mapIngredient(ingredient: FoodIngredient): FoodPart {
  return {
    id: String(ingredient.ingredient_id),
    title: ingredient.name,
    kcal: ingredient.nutrition.calories_kcal,
    nutrition: mapNutrition(ingredient.nutrition),
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
    nutrition: mapNutrition(data.nutrition),
    defaultUnitId: servingUnit?.id ?? "bite",
    servingWeightGrams: data.serving_weight_g,
    amountGrams: data.amount_g,
    generalUnits: servingUnit ? [servingUnit] : [],
    parts: data.ingredients.map(mapIngredient),
  };
}

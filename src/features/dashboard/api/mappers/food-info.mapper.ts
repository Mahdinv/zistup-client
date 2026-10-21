import type {
  FoodInfoResponse,
  FoodIngredient,
} from "../types/food-info.types";
import { formatServingUnit } from "../types/serving-unit.ts";
import type { Food, FoodPart } from "../types/quick-add-meal.types";
function mapIngredient(ingredient: FoodIngredient): FoodPart {
  return {
    id: String(ingredient.ingredient_id),
    title: ingredient.name,
    kcal: ingredient.nutrition.calories_kcal,
    initialAmount: ingredient.grams,
  };
}
export function mapFoodInfo({ data }: FoodInfoResponse): Food {
  return {
    id: String(data.food_id),
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
    defaultUnitId: data.serving_unit,
    servingWeightGrams: data.serving_weight_g,
    generalUnits: [
      { id: data.serving_unit, label: formatServingUnit(data.serving_unit) },
    ],
    parts: data.ingredients.map(mapIngredient),
  };
}

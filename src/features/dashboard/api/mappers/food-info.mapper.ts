import type {
  FoodInfoResponse,
  FoodIngredient,
  FoodNutrition,
} from "../types/food-info.types";
import type { DietFoodDto } from "../dto/diet-day.dto";
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
const unknownNutrition: Nutrition = {
  kcal: null,
  protein: null,
  carbohydrates: null,
  fiber: null,
  greenhouseGas: null,
  environmentalImpact: null,
  water: null,
};

function mapPlanParts(
  parts: FoodPart[],
  ingredients: DietFoodDto["ingredients"],
): FoodPart[] | undefined {
  if (!ingredients?.length) return undefined;
  const foodInfoById = new Map(parts.map((part) => [part.id, part]));
  const planById = new Map<string, FoodPart>();
  for (const ingredient of ingredients) {
    if (!ingredient || typeof ingredient === "string") continue;
    const { ingredient_id, grams } = ingredient;
    if (
      ingredient_id == null ||
      !Number.isSafeInteger(ingredient_id) ||
      ingredient_id <= 0
    )
      continue;

    const id = String(ingredient_id);
    const baseline = foodInfoById.get(id);
    const plannedGrams =
      typeof grams === "number" && Number.isFinite(grams) && grams >= 0
        ? grams
        : undefined;
    if (plannedGrams === undefined && !baseline) continue;
    planById.set(id, {
      id,
      title: ingredient.name,
      kcal: baseline?.kcal ?? null,
      nutrition: baseline?.nutrition ?? unknownNutrition,
      initialAmount: baseline?.initialAmount,
      plannedGrams,
    });
  }
  // Older plans can contain ingredient names without IDs or amounts.
  return planById.size ? [...planById.values()] : undefined;
}

export function mapFoodInfo(
  { data }: FoodInfoResponse,
  planIngredients?: DietFoodDto["ingredients"],
): Food {
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
  const parts = data.ingredients.map(mapIngredient);
  return {
    id: String(data.food_id),
    type: data.type,
    title: data.name,
    nutrition: mapNutrition(data.nutrition),
    defaultUnitId: servingUnit?.id ?? "bite",
    servingWeightGrams: data.serving_weight_g,
    amountGrams: data.amount_g,
    generalUnits: servingUnit ? [servingUnit] : [],
    parts,
    planParts: mapPlanParts(parts, planIngredients),
  };
}

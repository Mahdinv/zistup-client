import type {
  DetailedSelection,
  Food,
  FoodPart,
  Nutrition,
  QuantitySelection,
} from "../../api/types/quick-add-meal.types";
import { quantityToGrams } from "./meal-submission.ts";
import { ingredientQuantityToGrams } from "./ingredient-grams.ts";

function scaleNutrition(
  nutrition: Nutrition,
  grams: number | null,
  originalGrams: number | null | undefined,
): Nutrition {
  const scale =
    grams != null &&
    originalGrams != null &&
    Number.isFinite(originalGrams) &&
    originalGrams > 0
      ? grams / originalGrams
      : null;
  const scaleValue = (value: number | null): number | null => {
    if (grams === 0) return 0;
    const result = scale != null && value != null ? value * scale : NaN;
    return Number.isFinite(result) ? result : null;
  };

  return {
    kcal: scaleValue(nutrition.kcal),
    protein: scaleValue(nutrition.protein),
    fiber: scaleValue(nutrition.fiber),
    carbohydrates: scaleValue(nutrition.carbohydrates),
    greenhouseGas: scaleValue(nutrition.greenhouseGas),
    environmentalImpact: scaleValue(nutrition.environmentalImpact),
    water: scaleValue(nutrition.water),
  };
}

export function calculateIngredientNutrition(
  selection: QuantitySelection | undefined,
  part: FoodPart,
): Nutrition {
  const grams = selection
    ? ingredientQuantityToGrams(selection)
    : (part.initialAmount ?? null);
  // Always scale the original API contribution, never a previously scaled value.
  return scaleNutrition(part.nutrition, grams, part.initialAmount);
}

export function calculateMealNutrition(
  quantity: QuantitySelection,
  food: Food,
  detailed?: DetailedSelection | null,
): Nutrition {
  if (!detailed) {
    return scaleNutrition(
      food.nutrition,
      quantityToGrams(quantity, food),
      food.amountGrams,
    );
  }
  const parts = food.planParts ?? food.parts;
  // The API total is authoritative before edits (ingredient contributions may
  // carry different decimal precision). Keep the original grams untouched.
  if (
    parts.length > 0 &&
    parts.length === food.parts.length &&
    parts.every(
      (part) =>
        part.initialAmount != null &&
        Number.isFinite(part.initialAmount) &&
        part.initialAmount >= 0 &&
        ingredientQuantityToGrams(
          detailed[part.id] ?? {
            unitId: "gram",
            amount: part.initialAmount,
          },
        ) === part.initialAmount,
    )
  )
    return { ...food.nutrition };

  const totals: Nutrition = {
    kcal: 0,
    protein: 0,
    fiber: 0,
    carbohydrates: 0,
    greenhouseGas: 0,
    environmentalImpact: 0,
    water: 0,
  };
  const keys = Object.keys(totals) as (keyof Nutrition)[];
  for (const part of parts) {
    const contribution = calculateIngredientNutrition(detailed[part.id], part);
    for (const key of keys) {
      const total = totals[key];
      const value = contribution[key];
      const sum = total != null && value != null ? total + value : NaN;
      totals[key] = Number.isFinite(sum) ? sum : null;
    }
  }
  return totals;
}

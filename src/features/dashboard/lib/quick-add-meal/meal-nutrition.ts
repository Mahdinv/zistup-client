import type { Food, Nutrition, QuantitySelection } from "../../api/types/quick-add-meal.types";
import { quantityToGrams } from "./meal-submission.ts";

export function calculateMealNutrition(
  quantity: QuantitySelection,
  food: Food,
): Nutrition {
  const grams = quantityToGrams(quantity, food);
  const scale =
    grams != null && Number.isFinite(food.amountGrams) && food.amountGrams > 0
      ? grams / food.amountGrams
      : null;
  const scaleValue = (value: number | null): number | null =>
    scale != null && value != null && Number.isFinite(value)
      ? value * scale
      : null;

  return {
    kcal: scaleValue(food.nutrition.kcal),
    protein: scaleValue(food.nutrition.protein),
    fiber: scaleValue(food.nutrition.fiber),
    carbohydrates: scaleValue(food.nutrition.carbohydrates),
    greenhouseGas: scaleValue(food.nutrition.greenhouseGas),
    environmentalImpact: scaleValue(food.nutrition.environmentalImpact),
    water: scaleValue(food.nutrition.water),
  };
}

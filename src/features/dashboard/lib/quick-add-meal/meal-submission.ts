import type {
  AddMealPayload,
  SeparatedItem,
} from "../../api/types/add-meal.types";
import { ServingUnit } from "../../api/types/serving-unit.ts";
import { ingredientQuantityToGrams, INGREDIENT_UNITS } from "./ingredient-grams.ts";
import type {
  FlowState,
  Food,
  QuantitySelection,
} from "../../api/types/quick-add-meal.types";

const fixedGrams: Readonly<Partial<Record<string, number>>> = {
  palm: 30,
  [ServingUnit.Bite]: 35,
  [ServingUnit.Spoon]: 15,
  gram: 1,
};

export function quantityToGrams(
  quantity: QuantitySelection,
  food: Pick<Food, "defaultUnitId" | "servingWeightGrams"> & Partial<Pick<Food, "type">>,
): number | null {
  // Local units retain their fixed conversion even if also returned by the server.
  const baseUnit = food.type === "base_food" ? INGREDIENT_UNITS.find((unit) => unit.id === quantity.unitId) : undefined;
  const gramsPerUnit = baseUnit ? baseUnit.grams : Object.hasOwn(fixedGrams, quantity.unitId)
    ? fixedGrams[quantity.unitId]
    : quantity.unitId === food.defaultUnitId
      ? food.servingWeightGrams
      : undefined;
  if (
    gramsPerUnit == null ||
    !Number.isFinite(gramsPerUnit) ||
    gramsPerUnit <= 0 ||
    !Number.isFinite(quantity.amount) ||
    quantity.amount <= 0
  )
    return null;
  const grams = quantity.amount * gramsPerUnit;
  return Number.isFinite(grams) ? grams : null;
}

// This boundary can pass its result directly to a future mutation without UI state.
export function createSubmission(
  state: FlowState,
  food: Food,
): AddMealPayload | null {
  if (
    !state.mealId ||
    state.selectedFoodId == null ||
    !Number.isSafeInteger(state.selectedFoodId) ||
    String(state.selectedFoodId) !== food.id
  )
    return null;
  const value = quantityToGrams(state.quantity, food);
  if (value == null) return null;
  const separatedItems: SeparatedItem[] = [];
  if (state.detailed) {
    for (const part of food.parts) {
      const selection = state.detailed[part.id];
      const ingredientId = Number(part.id);
      const grams = selection ? ingredientQuantityToGrams(selection) : null;
      if (
        !Number.isSafeInteger(ingredientId) ||
        !selection ||
        grams == null ||
        !Number.isFinite(selection.amount) ||
        selection.amount < 0
      )
        return null;
      separatedItems.push({
        ingredient_id: ingredientId,
        value: grams,
      });
    }
  }
  return {
    foodId: state.selectedFoodId,
    type: food.type,
    value,
    meal: state.mealId,
    separatedItems,
  };
}

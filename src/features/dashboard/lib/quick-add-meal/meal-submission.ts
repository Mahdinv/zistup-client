import type {
  AddMealPayload,
  SeparatedItem,
} from "../../api/types/add-meal.types";
import { ServingUnit } from "../../api/types/serving-unit.ts";
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
  food: Pick<Food, "defaultUnitId" | "servingWeightGrams">,
): number | null {
  // Local units retain their fixed conversion even if also returned by the server.
  const gramsPerUnit = Object.hasOwn(fixedGrams, quantity.unitId)
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
      if (
        !Number.isSafeInteger(ingredientId) ||
        !selection ||
        selection.unitId !== "gram" ||
        !Number.isFinite(selection.amount) ||
        selection.amount <= 0
      )
        return null;
      separatedItems.push({
        ingredient_id: ingredientId,
        value: selection.amount,
      });
    }
  }
  return {
    foodId: state.selectedFoodId,
    value,
    meal: state.mealId,
    separatedItems,
  };
}

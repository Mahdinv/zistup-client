import { roundIngredientGrams } from "./ingredient-grams.ts";
import type {
  DetailedSelection,
  FlowState,
  Food,
  MealId,
  QuantitySelection,
  Step,
} from "../../api/types/quick-add-meal.types";
export const initialFlow: FlowState = {
  step: "meal",
  nextStep: null,
  mealId: null,
  query: "",
  selectedFoodId: null,
  quantity: { amount: 1, unitId: "" },
  detailed: null,
  activePartId: null,
};
export type FlowAction =
  | { type: "meal"; mealId: MealId }
  | { type: "query"; query: string }
  | { type: "food"; foodId: number }
  | { type: "quantity"; quantity: QuantitySelection }
  | { type: "detail"; partId: string; quantity: QuantitySelection }
  | { type: "part"; partId: string }
  | { type: "detailed"; food: Food; quantity?: QuantitySelection }
  | { type: "back" }
  | { type: "transition-complete" }
  | { type: "reset" };
const navigate = (state: FlowState, nextStep: Step): FlowState => ({
  ...state,
  nextStep,
});
export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  if (action.type === "reset") return initialFlow;
  if (action.type === "transition-complete")
    return state.nextStep
      ? { ...state, step: state.nextStep, nextStep: null }
      : state;
  if (state.nextStep) return state;
  switch (action.type) {
    case "meal":
      return navigate({ ...state, mealId: action.mealId }, "search");
    case "query":
      return { ...state, query: action.query };
    case "food":
      return navigate(
        state.selectedFoodId === action.foodId
          ? state
          : {
              ...state,
              selectedFoodId: action.foodId,
              quantity: initialFlow.quantity,
              detailed: null,
              activePartId: null,
            },
        "details",
      );
    case "quantity":
      return { ...state, quantity: action.quantity };
    case "part":
      return { ...state, activePartId: action.partId };
    case "detail":
      return state.detailed
        ? {
            ...state,
            detailed: { ...state.detailed, [action.partId]: action.quantity },
          }
        : state;
    case "detailed": {
      const quantity = action.quantity ?? state.quantity;
      const detailed: DetailedSelection = {};
      action.food.parts.forEach((part) => {
        if (part.initialAmount != null)
          detailed[part.id] = {
            unitId: "gram",
            amount: roundIngredientGrams(part.initialAmount),
          };
      });
      return {
        ...state,
        detailed,
        quantity,
        activePartId: action.food.parts[0]?.id ?? null,
      };
    }
    case "back":
      return state.step === "details" && state.detailed
        ? { ...state, detailed: null }
        : navigate(state, state.step === "details" ? "search" : "meal");
  }
}

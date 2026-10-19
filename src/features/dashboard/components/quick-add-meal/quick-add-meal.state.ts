import type {
  DetailedSelection,
  FlowState,
  Food,
  MealId,
  MealSubmission,
  QuantitySelection,
  Step,
} from "./quick-add-meal.types";
export const initialFlow: FlowState = {
  step: "meal",
  nextStep: null,
  mealId: null,
  query: "",
  food: null,
  quantity: { amount: 3, unitId: "bite" },
  detailed: null,
  activePartId: null,
};
export type FlowAction =
  | { type: "meal"; mealId: MealId }
  | { type: "query"; query: string }
  | { type: "food"; food: Food }
  | { type: "quantity"; quantity: QuantitySelection }
  | { type: "detail"; partId: string; quantity: QuantitySelection }
  | { type: "part"; partId: string }
  | { type: "detailed" }
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
        state.food?.id === action.food.id
          ? state
          : {
              ...state,
              food: action.food,
              quantity: initialFlow.quantity,
              detailed: null,
              activePartId: action.food.parts[0]?.id ?? null,
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
      const detailed: DetailedSelection = {};
      state.food?.parts.forEach((part) => {
        const unit = part.units[0];
        if (unit)
          detailed[part.id] = {
            unitId: unit.id,
            amount: Math.max(
              0.25,
              Math.round(
                state.quantity.amount *
                  (unit.amountPerGeneral[state.quantity.unitId] ?? 1) *
                  4,
              ) / 4,
            ),
          };
      });
      return { ...state, detailed };
    }
    case "back":
      return state.step === "details" && state.detailed
        ? { ...state, detailed: null }
        : navigate(state, state.step === "details" ? "search" : "meal");
  }
}
export function createSubmission(state: FlowState): MealSubmission | null {
  if (!state.mealId || !state.food) return null;
  return {
    mealId: state.mealId,
    foodId: state.food.id,
    quantity: { ...state.quantity },
    ...(state.detailed ? { detailed: structuredClone(state.detailed) } : {}),
  };
}

// Keep a bounded wheel while including exact mapped amounts, even for large servings.
export function getDetailedAmounts(
  food: Food,
  quantity: QuantitySelection,
): number[] {
  const mapped = food.parts.flatMap((part) =>
    part.units.map((unit) =>
      Math.max(
        0.25,
        Math.round(
          quantity.amount * (unit.amountPerGeneral[quantity.unitId] ?? 1) * 4,
        ) / 4,
      ),
    ),
  );
  const maximum = Math.max(
    200,
    ...mapped.map((amount) => Math.ceil(amount * 2)),
  );
  const step = Math.max(0.25, Math.ceil((maximum / 800) * 4) / 4);
  return [
    ...new Set([
      0.25,
      ...mapped,
      ...Array.from(
        { length: Math.floor(maximum / step) },
        (_, index) => (index + 1) * step,
      ),
    ]),
  ].sort((a, b) => a - b);
}

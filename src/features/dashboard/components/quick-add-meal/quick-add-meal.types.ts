export type MealId = "breakfast" | "lunch" | "snack" | "dinner";
export type QuantityUnit = { id: string; label: string };
export type Nutrition = {
  kcal: number;
  protein: number;
  fiber: number;
  carbohydrates: number;
};
export type DetailedUnit = QuantityUnit & {
  description: string;
  amountPerGeneral: Partial<Record<string, number>>;
};
export type FoodPart = {
  id: string;
  title: string;
  kcal: number;
  units: DetailedUnit[];
};
export type Food = {
  id: string;
  title: string;
  subtitle: string;
  nutrition: Nutrition;
  generalUnits: QuantityUnit[];
  parts: FoodPart[];
};
export type SearchState =
  | { status: "idle" }
  | { status: "results"; foods: Food[] }
  | { status: "not-found" };
export type QuantitySelection = { amount: number; unitId: string };
export type DetailedSelection = Record<string, QuantitySelection>;
export type MealSubmission = {
  mealId: MealId;
  foodId: string;
  quantity: QuantitySelection;
  detailed?: DetailedSelection;
};
export type Step = "meal" | "search" | "details";
export type FlowState = {
  step: Step;
  nextStep: Step | null;
  mealId: MealId | null;
  query: string;
  food: Food | null;
  quantity: QuantitySelection;
  detailed: DetailedSelection | null;
  activePartId: string | null;
};

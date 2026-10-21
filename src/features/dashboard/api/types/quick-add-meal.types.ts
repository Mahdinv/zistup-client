import type { MealType } from "./add-meal.types";
import type { MealSearchItem } from "./meal-search.types";
export type MealId = MealType;
export type QuantityUnit = { id: string; label: string };
export type Nutrition = {
  kcal: number | null;
  protein: number | null;
  fiber: number | null;
  carbohydrates: number | null;
  greenhouseGas: number | null;
  environmentalImpact: number | null;
  water: number | null;
};
export type FoodPart = {
  id: string;
  title: string;
  kcal: number | null;
  initialAmount?: number | null;
};
export type Food = {
  id: string;
  title: string;
  nutrition: Nutrition;
  generalUnits: QuantityUnit[];
  defaultUnitId?: string;
  servingWeightGrams: number;
  parts: FoodPart[];
};
export type SearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "results"; foods: MealSearchItem[] }
  | { status: "not-found" };
export type QuantitySelection = { amount: number; unitId: string };
export type DetailedSelection = Record<string, QuantitySelection>;
export type Step = "meal" | "search" | "details";
export type FlowState = {
  step: Step;
  nextStep: Step | null;
  mealId: MealId | null;
  query: string;
  selectedFoodId: number | null;
  quantity: QuantitySelection;
  detailed: DetailedSelection | null;
  activePartId: string | null;
};

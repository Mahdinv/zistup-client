import type { MealType } from "./add-meal.types";

export type LoggedMealIngredient = {
  ingredient_id: number;
  name: string;
  value: number;
};

export type LoggedMeal = {
  id: number;
  foodId: number;
  foodName: string;
  foodGroupId: number | null;
  /** Consumed weight in grams. */
  value: number;
  calories: number;
  meal: MealType;
  mealTime: string | null;
  separatedItems: LoggedMealIngredient[];
  createdAt: string;
};

export type MealLogsResponse = {
  success: boolean;
  date: string;
  count: number;
  items: LoggedMeal[];
};

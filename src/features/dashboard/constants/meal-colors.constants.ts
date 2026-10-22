import type { MealType } from "../api/types/add-meal.types";

export const mealColors = [
  { title: "صبحانه", value: "#FFEB66" },
  { title: "میان‌وعده صبح", value: "#06B6D4" },
  { title: "ناهار", value: "#FF9F45" },
  { title: "میان‌وعده عصر", value: "#F97316" },
  { title: "شام", value: "#7EBBD0" },
  { title: "۲ ساعت قبل خواب", value: "#7C3AED" },
] as const;

// A generic snack uses the shared snack color without inferring a time of day.
export const loggedMealTags = {
  breakfast: { title: "صبحانه", color: mealColors[0].value },
  lunch: { title: "ناهار", color: mealColors[2].value },
  snack: { title: "میان‌وعده", color: mealColors[1].value },
  dinner: { title: "شام", color: mealColors[4].value },
} satisfies Record<MealType, { title: string; color: string }>;

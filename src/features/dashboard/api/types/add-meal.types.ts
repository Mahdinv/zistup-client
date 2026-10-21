// Enum-style values follow ServingUnit and support erasableSyntaxOnly.
export const MealType = {
  Breakfast: "breakfast",
  Lunch: "lunch",
  Snack: "snack",
  Dinner: "dinner",
} as const;
export type MealType = (typeof MealType)[keyof typeof MealType];
export type SeparatedItem = { ingredient_id: number; value: number };
export type AddMealPayload = {
  foodId: number;
  value: number;
  meal: MealType;
  separatedItems: SeparatedItem[];
};

export type AddMealRequest = AddMealPayload & {
  client_event_id: string;
};

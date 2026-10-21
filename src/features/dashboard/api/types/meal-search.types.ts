import type { ServingUnit } from "./serving-unit";
export type MealSearchItem = {
  id: number;
  name: string;
  serving_unit: ServingUnit | (string & {});
  serving_weight: number;
  nutrition: { calories_kcal: number | null };
};

export type MealSearchResponse = {
  success: boolean;
  items: MealSearchItem[];
};

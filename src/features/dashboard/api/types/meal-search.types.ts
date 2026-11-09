import type { ServingUnit } from "./serving-unit";
import type { FoodInfoRequest } from "./food-info.types";
export type MealSearchItem = {
  id: number;
  type: FoodInfoRequest["type"];
  name: string;
  serving_unit: ServingUnit | (string & {});
  serving_weight: number;
  nutrition: { calories_kcal: number | null };
};

export type MealSearchResponse = {
  success: boolean;
  items: MealSearchItem[];
};

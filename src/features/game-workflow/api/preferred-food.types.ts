import type { FoodGroup } from "./food-group.types";

export type PreferredFood = {
  foodGroupId: number;
  foodGroup: FoodGroup;
  priority: number;
};

import type { FoodGroup } from "./food-group.types";

export type SocialAlignment = {
  foodGroupId: number;
  foodGroup: FoodGroup;
  priority: number;
  x: number;
};

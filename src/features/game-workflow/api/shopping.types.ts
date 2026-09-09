import type { FoodGroup } from "./food-group.types";

export type FreeShopping = {
  foodGroupId: number;
  foodGroup: FoodGroup;
  value: number;
};

export type LimitedShopping = {
  foodGroupId: number;
  foodGroup: FoodGroup;
  value: number;
  positionPrice: number;
  positionHealth: number;
  positionEnvironment: number;
  positionAvailable: number;
  importancePrice: number;
  importanceHealth: number;
  importanceEnvironment: number;
  importanceAvailable: number;
};

import type { FoodGroup } from "./food-group.types";

export type Category = {
  id: number;
  name: string;
  title: string;
  properties: CategoryProperties;
  foodGroups: FoodGroup[];
};

type CategoryProperties = {
  color: string;
};

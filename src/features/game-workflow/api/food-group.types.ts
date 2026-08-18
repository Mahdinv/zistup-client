export type FoodGroup = {
  id: number;
  code: number;
  title: string;
  categoryId: number;
  properties: FoodGroupProperties;
  imageUrl: string;
};

type FoodGroupProperties = {
  description?: string;
  weeklyConsumptionOption: number[];
};

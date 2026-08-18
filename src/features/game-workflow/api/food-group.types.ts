export type FoodGroup = {
  id: number;
  code: number;
  title: string;
  categoryId: number;
  properties: FoodGroupProperties;
};

type FoodGroupProperties = {
  description?: string;
  weeklyConsumptionOption: number[];
  imageUrl: string;
};

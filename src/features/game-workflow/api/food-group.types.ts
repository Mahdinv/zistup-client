export type FoodGroup = {
  id: number;
  code: number;
  title: string;
  name: string;
  categoryId: number;
  properties: FoodGroupProperties;
};

type FoodGroupProperties = {
  description?: string;
  weeklyConsumptionOption: number[];
  score: ParametersType;
  cost: ParametersType;
  imageUrl: string;
  unit: string;
};

type ParametersType = {
  price: number;
  health: number;
  environment: number;
  available: number;
};

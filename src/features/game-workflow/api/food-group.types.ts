export type FoodGroup = {
  id: number;
  code: number;
  title: string;
  name: string;
  categoryId: number;
  wanted?: {
    value: number | null;
  };
  provided?: {
    grams: number;
    value: number | null;
  };
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

export type ParametersType = {
  price: number;
  health: number;
  environment: number;
  available: number;
};

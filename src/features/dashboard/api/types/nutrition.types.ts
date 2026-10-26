export type Nutrient = {
  key: string;
  name: string;
  unit: string;
  consumed: number | null;
  target: number | null;
  status: string;
  subgroup: string;
};

export type NutritionAdvice = {
  name: string;
  advice: string;
};

export type NutritionResponse = {
  success: boolean;
  data: {
    nutrients: Nutrient[] | null;
    advices: NutritionAdvice[] | null;
  } | null;
};

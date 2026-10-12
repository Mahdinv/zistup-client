export type DietNutrition = {
  caloriesKcal: number;
  proteinG: number;
  carbohydrateG: number;
  fiberG: number;
};

export type DietFood = {
  id: string;
  title: string;
  source: string;
  category: string;
  imageUrl: string | null;
  quantity: { grams: number; servings: number; unit: string };
  ingredients: string[];
  nutrition: DietNutrition;
};

export type DietMeal = {
  id: string;
  key: string;
  title: string;
  status: string;
  main: DietFood | null;
  companions: DietFood[];
  nutrition: DietNutrition;
  totalGrams: number;
  alternatives: DietFood[];
  replacement: {
    target: string;
    keepCompanions: boolean;
    requiresRevalidation: boolean;
  };
};

export type DietDay = {
  day: number;
  title: string;
  nutrition: DietNutrition;
  meals: DietMeal[];
};

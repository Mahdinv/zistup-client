export type DietNutrition = {
  caloriesKcal: number;
  proteinG: number;
  carbohydrateG: number;
  fiberG: number;
};

export type DietIngredient = {
  name: string;
  id?: number;
  ingredient_id?: number;
  type?: "recipe" | "base_food";
  source_id?: string;
  grams?: number | null;
};

export type DietFood = {
  id: string;
  foodId: number;
  title: string;
  source: string;
  category: string;
  imageUrl: string | null;
  quantity: { grams: number; servings: number; unit: string };
  ingredients: DietIngredient[];
  nutrition: DietNutrition;
  companions: DietFood[];
  type: "recipe" | "base_food";
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
  alternatives: (DietFood | null)[];
  replacement: {
    target: string;
    keepCompanions: boolean;
    requiresRevalidation: boolean;
  } | null;
};

export type DietDay = {
  day: number;
  title: string;
  nutrition: DietNutrition;
  meals: DietMeal[];
};

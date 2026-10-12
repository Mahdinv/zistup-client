export type DietNutritionDto = {
  calories_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  fiber_g: number;
};

export type DietFoodDto = {
  id: string;
  title: string;
  source: string;
  category: string;
  image_url: string | null;
  quantity: { grams: number; servings: number; unit: string };
  ingredients: string[];
  nutrition: DietNutritionDto;
};

export type DietMealDto = {
  id: string;
  key: string;
  title: string;
  status: string;
  main: DietFoodDto | null;
  companions: DietFoodDto[];
  nutrition: DietNutritionDto;
  total_grams: number;
  alternatives: DietFoodDto[];
  replacement: {
    target: string;
    keep_companions: boolean;
    requires_revalidation: boolean;
  };
};

export type DietDayDto = {
  day: number;
  title: string;
  nutrition: DietNutritionDto;
  meals: DietMealDto[];
};

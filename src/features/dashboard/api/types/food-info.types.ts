import type { ServingUnit } from "./serving-unit";
export type FoodNutrition = {
  calories_kcal: number | null;
  protein_g: number | null;
  carbohydrate_g: number | null;
  fiber_g: number | null;
  ghg_kg_co2eq: number | null;
  ef_single_score_mpt: number | null;
  water_l: number | null;
};
export type FoodIngredient = {
  ingredient_id: number;
  name: string;
  grams: number;
  nutrition: FoodNutrition;
};
export type FoodInfoResponse = {
  success: boolean;
  data: {
    food_id: number;
    name: string;
    serving_unit: ServingUnit | (string & {});
    serving_weight_g: number;
    amount_g: number;
    nutrition: FoodNutrition;
    ingredients: FoodIngredient[];
  };
};

import type { DietDay } from "./diet-day.types";
import type { Shopping } from "./shopping.types";
import type { DietGoalsSummary } from "./diet-goals-summary.types";

type DietNutrition = {
  calories_kcal?: number;
  protein_g?: number;
  carbohydrate_g?: number;
  fiber_g?: number;
};

export type DietResponse = {
  summary?: {
    day_count?: number;
    person_count?: number;
    daily_calorie_target_kcal?: number;
    weekly_nutrition?: DietNutrition;
    daily_targets?: DietNutrition;
    daily_average?: DietNutrition;
  };
  createdAtUtc: string;
  days: DietDay[];
  diet: { key: string; title: string };
  shopping: Shopping;
  dietGoalsSummary?: DietGoalsSummary | null;
};

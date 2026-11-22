import { httpClient } from "@/shared/api";
import type { DietFoodDto } from "@/features/dashboard/api/dto/diet-day.dto";

export type MealType = "breakfast" | "lunch" | "dinner";

export type MealSelection = {
  diet: "zistpa";
  meals: Array<{
    day: number;
    meal: MealType;
    id: number;
    type: string;
    value: number;
  }>;
};

type MealAlternativesResponse = {
  success?: boolean;
  data?: { alternatives?: (Partial<DietFoodDto> | null)[] | null } | null;
};

export async function getMealAlternatives(meal: MealType) {
  const response = await httpClient.get<MealAlternativesResponse>(
    "/diet/v2/plan/alternatives",
    {
      params: { diet: "zistpa", meal },
    },
  );

  return response.data;
}

export async function selectMealAlternative(payload: MealSelection) {
  const response = await httpClient.post("/diet/v2/plan/meals", payload);
  return response.data;
}

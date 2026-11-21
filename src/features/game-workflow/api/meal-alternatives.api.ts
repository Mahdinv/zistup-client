import { httpClient } from "@/shared/api";
import type { DietFoodDto } from "@/features/dashboard/api/dto/diet-day.dto";

export type MealType = "breakfast" | "lunch" | "dinner";

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

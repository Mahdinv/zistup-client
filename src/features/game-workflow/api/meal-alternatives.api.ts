import { httpClient } from "@/shared/api";

export type MealType = "breakfast" | "lunch" | "dinner";

export async function getMealAlternatives(meal: MealType): Promise<unknown> {
  const response = await httpClient.get<unknown>("/diet/v2/plan/alternatives", {
    params: { diet: "zistpa", meal },
  });

  return response.data;
}

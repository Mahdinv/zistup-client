import { httpClient } from "@/shared/api";
import type { NutritionResponse } from "./types/nutrition.types";

export async function getNutrition(date: string, signal?: AbortSignal) {
  const response = await httpClient.get<NutritionResponse>(
    "/dashboard/nutrition",
    {
      params: { date },
      signal,
    },
  );

  return response.data || null;
}

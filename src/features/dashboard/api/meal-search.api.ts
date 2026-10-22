import { httpClient } from "@/shared/api";
import type { MealSearchResponse } from "./types/meal-search.types";

export async function searchMeals(
  name: string,
  signal?: AbortSignal,
): Promise<MealSearchResponse> {
  const response = await httpClient.post<MealSearchResponse>(
    "/dashboard/meal-search",
    { name: name.trim() },
    { signal },
  );
  return response.data;
}

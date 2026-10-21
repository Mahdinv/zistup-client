import { ApiError, httpClient } from "@/shared/api";
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
  // Structured backend errors are handled by the shared interceptor.
  if (!response.data.success) {
    throw new ApiError({
      type: "api",
      message: "جستجوی غذا ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/meal-search",
    });
  }
  return response.data;
}

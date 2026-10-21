import { ApiError, httpClient } from "@/shared/api";
import type { AddMealRequest } from "./types/add-meal.types";

export async function addMeal(payload: AddMealRequest): Promise<void> {
  const response = await httpClient.post<{ success?: boolean }>(
    "/dashboard/meal-logs",
    payload,
  );
  if (response.data?.success === false) {
    throw new ApiError({
      type: "api",
      message: "ثبت غذا ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/meal-logs",
    });
  }
}

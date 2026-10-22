import { ApiError, httpClient } from "@/shared/api";
import type { MealLogsResponse } from "./types/meal-logs.types";

export async function getMealLogs(
  date: string,
  signal?: AbortSignal,
): Promise<MealLogsResponse> {
  const response = await httpClient.get<MealLogsResponse>(
    "/dashboard/meal-logs",
    {
      params: { date },
      signal,
    },
  );
  if (!response.data.success) {
    throw new ApiError({
      type: "api",
      message: "دریافت وعده‌های ثبت‌شده ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "GET",
      url: "/dashboard/meal-logs",
    });
  }
  return response.data;
}

export async function deleteMealLog(id: number): Promise<void> {
  const response = await httpClient.post<{ success?: boolean }>(
    "/dashboard/meal-logs/delete",
    { id },
  );
  if (response.data?.success === false) {
    throw new ApiError({
      type: "api",
      message: "حذف وعده ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/meal-logs/delete",
    });
  }
}

export async function deleteDayMealLogs(date: string): Promise<void> {
  const response = await httpClient.post<{ success?: boolean }>(
    "/dashboard/meal-logs/delete-day",
    { date },
  );
  if (response.data?.success === false) {
    throw new ApiError({
      type: "api",
      message: "حذف وعده‌های روز ناموفق بود. لطفاً دوباره تلاش کنید.",
      method: "POST",
      url: "/dashboard/meal-logs/delete-day",
    });
  }
}

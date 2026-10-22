import { httpClient } from "@/shared/api";
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
  return response.data;
}

export async function deleteMealLog(id: number): Promise<void> {
  await httpClient.post(
    "/dashboard/meal-logs/delete",
    { id },
  );
}

export async function deleteDayMealLogs(date: string): Promise<void> {
  await httpClient.post(
    "/dashboard/meal-logs/delete-day",
    { date },
  );
}

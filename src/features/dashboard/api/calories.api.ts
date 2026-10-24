import { httpClient } from "@/shared/api";
import type { CaloriesResponse } from "./types/calories.types";

export async function getCalories(
  date: string,
  signal?: AbortSignal,
): Promise<CaloriesResponse> {
  const response = await httpClient.get<CaloriesResponse>("/dashboard/calories", {
    params: { date },
    signal,
  });
  return response.data;
}
